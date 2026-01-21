import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../config/redis";
import { UserModel } from "../models/user.model";

interface ExternalPayload {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    link?: string;
    dob?: string;
}

new Worker(
    "user-sync-queue",
    async (job) => {
        const users: ExternalPayload[] = job.data.users;
        console.log({ users })

        try {
            console.log("🚀 Sending batch to external API");

            // 🔁 Format DOB to DD/M M/YYYY
            const payload = users.map((u) => ({
                id: Number(u.id),
                name: u.name,
                email: u.email,
                phoneNumber: u.phoneNumber,
                link: u.link,
                dob: u.dob
                    ? new Date(u.dob).toLocaleDateString("en-GB")
                    : undefined,
            }));

            // 🌐 Call external API
            const response = await axios.post(
                "https://dev.micro.mgsigma.net/batch/process",
                payload,
                { timeout: 10000 }
            );
            console.log({ response: response.data })

            const results: { id: string; status: "SUCCESS" | "FAILED" }[] =
                response.data;

            // 🔄 Update DB based on response
            for (const result of results) {
                await UserModel.updateOne(
                    { id: result.id },
                    { syncStatus: result.status }
                );

                console.log(`✔ User ${result.id}: ${result.status}`);
            }
        } catch (error) {
            let errorMessage = "Unknown error occurred";

            if (axios.isAxiosError(error)) {
                // Server responded with error (4xx / 5xx)
                if (error.response) {
                    errorMessage =
                        error.response.data?.message ||
                        JSON.stringify(error.response.data);
                }
                // Request sent but no response
                else if (error.request) {
                    errorMessage = "No response from external API";
                }
                // Axios config / setup error
                else {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error("❌ External API Error:", errorMessage);

            await UserModel.updateMany(
                { _id: { $in: users.map((u) => u.id) } },
                { syncStatus: "FAILED" }
            );
        }
    },
    { connection: redisConnection }
);

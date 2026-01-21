import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { UserModel } from "../models/user.model";

interface ExternalPayload {
    id: number;
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
        console.log(`📦 Processing batch of ${users.length} users`);

        try {
            const payload = users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phoneNumber: u.phoneNumber,
                link: u.link,
                dob: u.dob ? new Date(u.dob).toLocaleDateString("en-GB") : undefined,
            }));

            // 🌐 Call external API
            const response = await axios.post(
                "https://dev.micro.mgsigma.net/batch/process",
                payload,
                { timeout: 10000 },
            );

            const results: { id: number; status: "SUCCESS" | "FAILED" }[] = response.data;

            // 🔄 Update DB based on response
            if (Array.isArray(results)) {
                for (const result of results) {
                    await UserModel.updateOne(
                        { id: result.id },
                        { syncStatus: result.status },
                    );
                    console.log(`✔ User ${result.id}: ${result.status}`);
                }
            } else {
                console.error("❌ Unexpected response format from external API");
                throw new Error("Invalid API response format");
            }
        } catch (error) {
            let errorMessage = "Unknown error occurred";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error(`❌ External API Error: ${errorMessage}`);

            // Mark all users in this batch as FAILED so they can be retried
            await UserModel.updateMany(
                { id: { $in: users.map((u) => u.id) } },
                { syncStatus: "FAILED" },
            );
        }
    },
    { connection: redisConnection },
);

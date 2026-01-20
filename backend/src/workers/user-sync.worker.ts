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

        try {
            console.log("🚀 Sending batch to external API");

            // 🔁 Format DOB to DD/MM/YYYY
            const payload = users.map((u) => ({
                id: u.id,
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

            const results: { id: string; status: "SUCCESS" | "FAILED" }[] =
                response.data;

            // 🔄 Update DB based on response
            for (const result of results) {
                await UserModel.updateOne(
                    { _id: result.id },
                    { syncStatus: result.status }
                );

                console.log(`✔ User ${result.id}: ${result.status}`);
            }
        } catch (error) {
            console.error("❌ External API failed, marking batch FAILED");

            // If API call fails entirely → mark all as FAILED
            await UserModel.updateMany(
                { _id: { $in: users.map((u) => u.id) } },
                { syncStatus: "FAILED" }
            );
        }
    },
    { connection: redisConnection }
);

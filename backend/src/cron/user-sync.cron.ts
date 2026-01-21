import cron from "node-cron";
import { userSyncQueue } from "../queues/user-sync.queue";
import { UserModel } from "../models/user.model";

// Every 2 hours
cron.schedule("*/3 * * * * *", async () => {
    console.log("⏰ User sync scheduler started");

    const users = await UserModel.find({
        syncStatus: { $in: ["PENDING", "FAILED"] },
    })
        .limit(10)
        .lean();

    if (!users.length) {
        console.log("✅ No users to sync");
        return;
    }

    console.log({ users })
    await userSyncQueue.add("user-sync-queue", {
        users: users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phoneNumber: u.phone,
            link: u.profileUrl,
            dob: u.dob,
        })),
    });


    console.log(`📦 Queued ${users.length} users`);
});

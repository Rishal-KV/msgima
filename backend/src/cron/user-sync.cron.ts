import cron from "node-cron";
import { UserModel } from "../models/user.model";
import { userSyncQueue } from "../queues/user-sync.queue";

// Every 2 hours
cron.schedule("0 */2 * * *", async () => {
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

    await userSyncQueue.add("user-sync-job", {
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

import { type Document, model, Schema } from "mongoose";

// Counter schema for auto-incrementing numeric IDs
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = model("Counter", counterSchema);

export interface IUser extends Document {
  id: number; // strictly unique numeric identifier
  name: string;
  email: string;
  phone: string;
  profileUrl?: string;
  dob?: Date;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: "PENDING" | "SUCCESS" | "FAILED";
}

const userSchema = new Schema<IUser>(
  {
    id: { type: Number, unique: true, index: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default: null,
    },
    syncStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
      index: true,
    },
    dob: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-increment id before creating a new user
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "user_id_counter" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter?.seq || 1;
      next();
    } catch (error) {
      next(error as any);
    }
  } else {
    next();
  }
});

export const UserModel = model<IUser>("User", userSchema);

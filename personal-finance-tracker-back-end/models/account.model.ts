import mongoose, { Schema } from "mongoose";
import { IAccount } from "../interfaces/account.interface";

const accountSchema = new Schema<IAccount>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNumber: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>("Account", accountSchema);

import mongoose, { Schema } from "mongoose";
import { IBudget } from "../interfaces/budget.interface";

const budgetSchema = new Schema<IBudget>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    periodStartDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", budgetSchema);

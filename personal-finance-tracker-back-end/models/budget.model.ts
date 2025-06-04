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
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    limitAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", budgetSchema);

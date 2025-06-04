import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);

import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 * @throws {Error} If the connection fails
 * @description This function connects to the MongoDB database using the connection string stored in the environment variable MONGO_URI. If the connection is successful, it logs a success message to the console. If the connection fails, it logs the error and exits the process with a failure code.
 */

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

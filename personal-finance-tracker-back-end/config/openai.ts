require("dotenv").config();
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || "https://openrouter.ai/api/v1",
  timeout: 10000, // Optional: Set a timeout for requests
});

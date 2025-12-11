import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./docs/swagger";
import mainRouter from "./routes/index";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger before routes
setupSwagger(app);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Personal Finance Tracker API", status: "running" });
});

app.use("/api", mainRouter);

export default app;

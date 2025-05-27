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

app.use("/api", mainRouter);

setupSwagger(app);

export default app;

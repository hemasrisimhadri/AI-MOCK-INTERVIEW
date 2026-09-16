import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({
    message: "AI Mock Interview API is running",
  });
});

export default app;
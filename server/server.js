import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

dotenv.config();

// connect to MongoDB
connectDB();

const app = express();

// 🔥 CORS FIX (IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tvr-deploy-stack.vercel.app"
  ],
  credentials: true
}));

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
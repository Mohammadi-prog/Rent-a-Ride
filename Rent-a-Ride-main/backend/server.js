// backend/server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/vendorRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "../utils/cloudinaryConfig.js";

dotenv.config();  // must be at very top

// DEBUG: verify your Mongo connection string
console.log("DEBUG: mongo_uri =", process.env.mongo_uri);

if (!process.env.mongo_uri) {
  console.error("❌ MONGO_URI is undefined. Make sure it's set in your .env file.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "https://rent-a-ride-two.vercel.app",
  "http://localhost:5173"
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  credentials: true,
}));

// Cloudinary config
app.use("*", cloudinaryConfig);

// MongoDB connection - no deprecated options
mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// API routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vendor", vendorRoute);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

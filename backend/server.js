import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import userRujukanRoutes from "./routes/userRujukanRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Folder upload
const uploadPath = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📂 Folder upload dibuat:", uploadPath);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rujukan", userRujukanRoutes); // ← khusus rujukan

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err);

  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Ukuran file terlalu besar (maks 2MB)",
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: err.message || err,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

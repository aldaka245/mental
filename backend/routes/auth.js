// routes/auth.js
import express from "express";
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.SECRET_KEY;
const resend = new Resend(process.env.RESEND_API_KEY);

// ==============================
// REGISTER
// ==============================
router.post("/register", async (req, res) => {
  const { username, password, email, role = "user" } = req.body;

  try {
    if (!username || !password || !email)
      return res.status(400).json({ message: "Semua field wajib diisi" });

    const [cek] = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (cek.length)
      return res.status(400).json({ message: "Username atau email sudah digunakan" });

    const hash = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hash, email, role]
    );

    res.json({ message: "Register berhasil" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Gagal register" });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (!rows.length)
      return res.status(400).json({ message: "User tidak ditemukan" });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        id: rows[0].id,
        username: rows[0].username,
        role: rows[0].role,
      },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    // ✅ Jangan kirim "Bearer " di sini, cukup token murni
    res.json({
      message: "Login berhasil",
      token, 
      role: rows[0].role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login gagal" });
  }
});

// ==============================
// LUPA PASSWORD
// ==============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Email tidak terdaftar" });

    const token = jwt.sign({ id: rows[0].id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Reset Password PentaSoul",
      html: `<p>Klik link berikut untuk reset password:</p><a href="${link}">${link}</a>`,
    });

    res.json({ message: "Link reset password telah dikirim" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Gagal mengirim email reset password" });
  }
});

export default router;

import express from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import dotenv from "dotenv";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ==========================================================
   DASHBOARD ADMIN - DATA PENGGUNA
========================================================== */
router.get("/users", authenticate(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username, role, email FROM users"
    );
    const total_users = rows.length;
    res.json({ total_users, users: rows });
  } catch (err) {
    console.error("Error /users:", err);
    res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
});

/* ==========================================================
   DASHBOARD ADMIN - STATISTIK
========================================================== */
router.get("/stats", authenticate(["admin"]), async (req, res) => {
  try {
    const [[userCount]] = await db.execute(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    const [[pertanyaanCount]] = await db.execute(
      "SELECT COUNT(*) AS total_pertanyaan FROM pertanyaan"
    );
    const [[riwayatCount]] = await db.execute(
      "SELECT COUNT(*) AS total_riwayat FROM diagnosa_history"
    );

    res.json({
      total_users: userCount.total_users,
      total_pertanyaan: pertanyaanCount.total_pertanyaan,
      total_riwayat: riwayatCount.total_riwayat,
    });
  } catch (err) {
    console.error("Error /stats:", err);
    res.status(500).json({ message: "Gagal mengambil statistik" });
  }
});

/* ==========================================================
   RIWAYAT PEMERIKSAAN
========================================================== */
router.get("/riwayat-pemeriksaan", authenticate(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        u.username AS nama_user,
        r.hasil AS hasil_diagnosa,
        r.level,
        r.created_at
      FROM diagnosa_history r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error /riwayat-pemeriksaan:", err);
    res.status(500).json({ message: "Gagal mengambil riwayat pemeriksaan" });
  }
});

/* ==========================================================
   UPLOAD DATASET CSV
========================================================== */
router.post(
  "/upload-dataset",
  authenticate(["admin"]),
  upload.single("dataset"),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "File CSV tidak ditemukan" });

    const data = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", async () => {
        try {
          for (let row of data) {
            // ====== Pertanyaan ======
            const [q] = await db.execute(
              "SELECT id FROM pertanyaan WHERE teks_pertanyaan = ?",
              [row.pertanyaan]
            );
            let pertanyaan_id;
            if (q.length > 0) pertanyaan_id = q[0].id;
            else {
              const [insertQ] = await db.execute(
                "INSERT INTO pertanyaan (teks_pertanyaan) VALUES (?)",
                [row.pertanyaan]
              );
              pertanyaan_id = insertQ.insertId;
            }

            // ====== Gejala ======
            const [g] = await db.execute(
              "SELECT id FROM gejala WHERE kode = ?",
              [row.kode_gejala]
            );
            let gejala_id;
            if (g.length > 0) gejala_id = g[0].id;
            else {
              const [insertG] = await db.execute(
                "INSERT INTO gejala (kode, nama_gejala, penyakit) VALUES (?, ?, ?)",
                [row.kode_gejala, row.nama_gejala, row.penyakit]
              );
              gejala_id = insertG.insertId;
            }

            // ====== Relasi Pertanyaan-Gejala ======
            await db.execute(
              "INSERT INTO pertanyaan_gejala (pertanyaan_id, gejala_id, cf_pakar) VALUES (?, ?, ?)",
              [pertanyaan_id, gejala_id, row.cf_pakar]
            );
          }

          fs.unlinkSync(file.path);
          res.json({ message: "✅ Dataset berhasil di-upload" });
        } catch (err) {
          console.error("Upload error:", err);
          res.status(500).json({ message: "❌ Gagal upload dataset" });
        }
      });
  }
);

/* ==========================================================
   PREVIEW DATASET
========================================================== */
router.get(
  "/dataset-preview",
  authenticate(["admin"]),
  async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.teks_pertanyaan AS pertanyaan,
          g.kode AS kode_gejala,
          g.nama_gejala,
          g.penyakit,
          pg.cf_pakar
        FROM pertanyaan_gejala pg
        JOIN pertanyaan p ON pg.pertanyaan_id = p.id
        JOIN gejala g ON pg.gejala_id = g.id
        LIMIT 10
      `);

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal mengambil preview dataset" });
    }
  }
);

/* ==========================================================
   HAPUS DATASET
========================================================== */
router.delete(
  "/delete-dataset",
  authenticate(["admin"]),
  async (req, res) => {
    try {
      await db.execute("DELETE FROM pertanyaan_gejala");
      // opsional:
      // await db.execute("DELETE FROM pertanyaan");
      // await db.execute("DELETE FROM gejala");

      res.json({ message: "🗑️ Dataset berhasil dihapus" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal menghapus dataset" });
    }
  }
);


/* ==========================================================
   PENGAJUAN RUJUKAN PSIKOLOG
========================================================== */
// Ambil semua pengajuan rujukan
router.get("/rujukan", authenticate(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.id, u.username, r.nama, r.alamat, r.tgl_lahir, r.psikolog, r.jadwal, r.status, r.created_at
      FROM rujukan r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error /rujukan:", err);
    res.status(500).json({ message: "Gagal mengambil data rujukan" });
  }
});

// Update status rujukan (approve/reject)
router.patch("/rujukan/:id", authenticate(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected' | 'pending'

  const allowedStatus = ["approved", "rejected", "pending"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    // 1. Ambil user_id pemilik rujukan
    const [[rujukan]] = await db.execute(
      "SELECT user_id FROM rujukan WHERE id = ?",
      [id]
    );

    if (!rujukan) {
      return res.status(404).json({ message: "Rujukan tidak ditemukan" });
    }

    // 2. Update status rujukan
    await db.execute(
      "UPDATE rujukan SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    // 3. Cek preferensi notifikasi user
    const [[userPref]] = await db.execute(
      "SELECT notifikasi_aktif FROM users WHERE id = ?",
      [rujukan.user_id]
    );

    // 4. Kirim notifikasi jika aktif
    if (userPref?.notifikasi_aktif === 1) {
      await db.execute(
        `INSERT INTO notifikasi (user_id, judul, pesan)
         VALUES (?, ?, ?)`,
        [
          rujukan.user_id,
          "Status Rujukan Diperbarui",
          `Status pengajuan rujukan kamu sekarang: ${status}`
        ]
      );
    }

    res.json({
      message: `Rujukan berhasil diupdate menjadi ${status}`
    });
  } catch (err) {
    console.error("Error update rujukan:", err);
    res.status(500).json({ message: "Gagal update status rujukan" });
  }
});



export default router;

import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { generateSuratRujukan } from "../utils/generateSuratRujukan.js";




const router = express.Router();


// =========================
// POST - Ajukan Rujukan
// =========================
router.post("/", authenticate(["user"]), async (req, res) => {
  try {
    const { nama, alamat, tgl_lahir, psikolog, jadwal } = req.body;

    if (!nama || !alamat || !tgl_lahir || !psikolog || !jadwal) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    // Validasi format tanggal
    if (isNaN(Date.parse(tgl_lahir))) {
      return res.status(400).json({ error: "Format tanggal lahir tidak valid" });
    }

    const query = `
      INSERT INTO rujukan 
      (user_id, nama, alamat, tgl_lahir, psikolog, jadwal, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    await db.execute(query, [
      req.user.id,
      nama,
      alamat,
      tgl_lahir,
      psikolog,
      jadwal,
    ]);

    res.status(201).json({ message: "Rujukan berhasil diajukan" });
  } catch (err) {
    console.error("POST /rujukan error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// =========================
// GET - Riwayat Rujukan User
// =========================
router.get("/", authenticate(["user"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, nama, alamat, tgl_lahir, psikolog, jadwal, status, catatan_admin, created_at
       FROM rujukan
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /rujukan error:", err);
    res.status(500).json({ error: "Gagal mengambil riwayat rujukan" });
  }
});

// =========================
// PATCH - ACC Rujukan (Admin)
// =========================
router.patch("/:id/approve", authenticate(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM rujukan WHERE id=?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rujukan tidak ditemukan" });
    }

    const data = rows[0];
    const { catatan_admin } = req.body; // <-- ambil catatan admin dari body

    await generateSuratRujukan(data, "approved");

    // update status + catatan admin
    await db.execute(
      "UPDATE rujukan SET status='approved', catatan_admin=?, updated_at=NOW() WHERE id=?",
      [catatan_admin || null, req.params.id]
    );

    res.json({ message: "Rujukan disetujui" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Gagal ACC rujukan" });
  }
});


// =========================
// PATCH - Reject Rujukan (Admin)
// =========================
router.patch("/:id/reject", authenticate(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM rujukan WHERE id=?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rujukan tidak ditemukan" });
    }

    const data = rows[0];
    const { catatan_admin } = req.body;

    await generateSuratRujukan(data, "rejected");

    await db.execute(
      "UPDATE rujukan SET status='rejected', catatan_admin=?, updated_at=NOW() WHERE id=?",
      [catatan_admin || null, req.params.id]
    );

    res.json({ message: "Rujukan ditolak" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ error: "Gagal menolak rujukan" });
  }
});


// GET rujukan milik user
router.get("/user", authenticate(["user"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT id, nama, psikolog, jadwal, status, catatan_admin, created_at 
       FROM rujukan WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil rujukan user" });
  }
});

router.get("/:id/download", authenticate(["user", "admin"]), async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM rujukan WHERE id=?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Rujukan tidak ditemukan" });
        }

        const data = rows[0];

        // BUAT PDF SAAT ITU JUGA
        const pdfBuffer = await generateSuratRujukan(data, data.status);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="surat-rujukan-${data.id}.pdf"`
        );

        res.send(pdfBuffer);

    } catch (err) {
        console.error("Download PDF error:", err);
        res.status(500).json({ error: "Gagal membuat PDF" });
    }
});



export default router;

import express from "express";
import { db } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// =======================================
// Konfigurasi folder penyimpanan foto
// =======================================
const uploadDir = "public/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const userId = req.user ? req.user.id : "unknown";
    cb(null, `user_${userId}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Hanya file gambar (JPG, PNG) yang diperbolehkan"));
    }
    cb(null, true);
  },
});

// =======================================
// GET Profil User
// =======================================
router.get("/profile", authenticate(["user"]), async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      "SELECT id, username, role, foto FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length)
      return res.status(404).json({ error: "User tidak ditemukan" });

    const user = rows[0];

    // 🔧 Fix URL foto biar bisa diakses frontend
    if (user.foto) {
      user.foto = `${process.env.BACKEND_URL || "http://localhost:5000"}${user.foto}`;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil profil" });
  }
});



// =======================================
// PUT Update Profil + Upload Foto
// =======================================
router.put(
  "/profile",
  authenticate(["user"]),
  upload.single("foto"),
  async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const fields = [];
      const values = [];

      if (username) {
        fields.push("username = ?");
        values.push(username);
      }
      if (fotoPath) {
        fields.push("foto = ?");
        values.push(fotoPath);
      }

      if (fields.length === 0)
        return res.status(400).json({ error: "Tidak ada data untuk diupdate" });

      values.push(userId);

      await db.execute(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      const fullFotoUrl = fotoPath
        ? `${process.env.BACKEND_URL || "http://localhost:5000"}${fotoPath}`
        : null;

      res.json({ message: "Profil diperbarui", foto: fullFotoUrl });
    } catch (err) {
      console.error("Error saat update profil:", err);
      res.status(500).json({ error: "Gagal memperbarui profil" });
    }
  }
);


// =======================================
// GET Riwayat Diagnosa User
// =======================================
router.get("/riwayat", authenticate(["user"]), async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM diagnosa_history WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil riwayat diagnosa" });
  }
});

// =======================================
// POST Cek Mental (Certainty Factor)
// =======================================
router.post("/cek-mental", authenticate(["user"]), async (req, res) => {
  const jawaban = req.body;
  const userId = req.user.id;

  try {
    const [rel] = await db.execute(`
      SELECT pg.pertanyaan_id, g.nama_gejala, g.penyakit, pg.cf_pakar
      FROM pertanyaan_gejala pg
      JOIN gejala g ON pg.gejala_id = g.id
    `);

    const penyakitMap = {};
    for (let r of rel) {
      const nilaiUser = jawaban[r.pertanyaan_id] || 0;
      const cfUser = (nilaiUser - 1) / 4;
      const cf = r.cf_pakar * cfUser;

      if (!penyakitMap[r.penyakit]) penyakitMap[r.penyakit] = cf;
      else penyakitMap[r.penyakit] += cf * (1 - penyakitMap[r.penyakit]);
    }

    // Ambil semua solusi
const [solusiRows] = await db.execute("SELECT * FROM solusi");

const hasil = [];
for (let p in penyakitMap) {
  const cfFinal = penyakitMap[p];
  const persen = Math.round(cfFinal * 100);

  let level = "";
  if (persen <= 20) level = "Tidak Terindikasi";
  else if (persen <= 40) level = "Ringan";
  else if (persen <= 70) level = "Sedang";
  else level = "Berat";

  // Pilih solusi sesuai penyakit
  const s = solusiRows.find(
    (sol) =>
      sol.penyakit === (["Bipolar","Anxiety","Depresi"].includes(p) ? "mood" : "sosial") &&
      persen >= sol.min_persen &&
      persen <= sol.max_persen
  );

  hasil.push({
    penyakit: p,
    level,
    persen,
    solusi: s ? s.keterangan : "Tidak ada solusi spesifik",
  });
}


    for (let h of hasil) {
      await db.execute(
        `INSERT INTO diagnosa_history (user_id, hasil, level, persen, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, h.penyakit, h.level, h.persen]
      );
    }

    res.json({ hasil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghitung diagnosa" });
  }
});

// =======================================
// PUT Update Notifikasi (users.notifikasi_aktif)
// =======================================
router.put("/notifikasi", authenticate(["user"]), async (req, res) => {
  const userId = req.user.id;
  const { aktif } = req.body;

  try {
    await db.execute(
      "UPDATE users SET notifikasi_aktif = ? WHERE id = ?",
      [aktif ? 1 : 0, userId]
    );

    res.json({ message: "Pengaturan notifikasi diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memperbarui notifikasi" });
  }
});

// =======================================
// GET Status Notifikasi User
// =======================================
router.get("/notifikasi", authenticate(["user"]), async (req, res) => {
  const userId = req.user.id;

  try {
    const [[user]] = await db.execute(
      "SELECT notifikasi_aktif FROM users WHERE id = ?",
      [userId]
    );

    res.json({ aktif: user?.notifikasi_aktif ?? 1 });
  } catch (err) {
    console.error("Error GET /notifikasi:", err);
    res.status(500).json({ error: "Gagal mengambil notifikasi" });
  }
});

//GET LIST NOTIFIKASI
router.get("/notifikasi/list", authenticate(["user"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil notifikasi" });
  }
});

//TANDAI SUDAH DIBACA
router.put("/notifikasi/read/:id", authenticate(["user"]), async (req, res) => {
  try {
    await db.execute(
      "UPDATE notifikasi SET dibaca = 1 WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Gagal update notifikasi" });
  }
});


// =======================================
// GET Pertanyaan (untuk form cek mental)
// =======================================
router.get("/pertanyaan", authenticate(["user"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, teks_pertanyaan FROM pertanyaan ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil pertanyaan" });
  }
});


// =======================================
// POST Ajukan Surat Rujukan
// =======================================
// Route POST: buat rujukan baru
router.post("/", authenticate(["user"]), async (req, res) => {
  try {
    const { nama, alamat, tgl_lahir, psikolog, jadwal } = req.body;

    // Validasi sederhana
    if (!nama || !alamat || !tgl_lahir || !psikolog || !jadwal) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    const query = `
      INSERT INTO rujukan (user_id, nama, alamat, tgl_lahir, psikolog, jadwal, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    await db.query(query, [
      req.user.id,
      nama,
      alamat,
      tgl_lahir,
      psikolog,
      jadwal,
    ]);

    res.status(201).json({ message: "Rujukan berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// =======================================
// GET Riwayat Pengajuan Rujukan User
// =======================================
router.get("/rujukan", authenticate(["user"]), async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      `SELECT id, nama, alamat, tgl_lahir, psikolog, jadwal, status, created_at
       FROM rujukan
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error get rujukan:", err);
    res.status(500).json({ error: "Gagal mengambil riwayat pengajuan rujukan" });
  }
});

export default router;
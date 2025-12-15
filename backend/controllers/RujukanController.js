import { generateSuratRujukan } from "../utils/generateSuratRujukan.js";
import path from "path";

export async function createRujukan(req, res) {
  try {
    const data = req.body;       // data pasien
    const status = "DITERIMA";   // atau dari database

    // generate PDF
    const result = await generateSuratRujukan(data, status);

    return res.json({
      success: true,
      message: "Surat berhasil dibuat",
      file: `/uploads/rujukan/${result.filename}`
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal membuat surat",
      error: err.message
    });
  }
}

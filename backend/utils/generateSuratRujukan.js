import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";

export function generateSuratRujukan(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 60
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ================= STATUS ================= */

      let statusText = "MENUNGGU";
      let statusColor = "orange";

      if (data.status === "approved") {
        statusText = "DISETUJUI";
        statusColor = "green";
      } else if (data.status === "rejected") {
        statusText = "DITOLAK";
        statusColor = "red";
      }

      /* ================= WATERMARK ================= */

      doc.save();
      doc.rotate(-45, { origin: [300, 400] });
      doc
        .font("Helvetica-Bold")
        .fontSize(60)
        .fillColor(statusColor)
        .opacity(0.15)
        .text(statusText, 100, 350, {
          align: "center",
          width: 400
        });
      doc.restore();
      doc.opacity(1).fillColor("black");

      /* ================= HEADER ================= */

      doc.image("assets/logo-pentasoul.jpg", 60, 40, { width: 80 });

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("PENTASOUL", 150, 45);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          "Layanan Kesehatan Mental Terintegrasi\nPurwokerto, Indonesia\nwww.perkak.com",
          150,
          65
        );

      doc.moveTo(60, 120).lineTo(550, 120).stroke();

      /* ================= JUDUL ================= */

      doc.moveDown(3);
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("SURAT RUJUKAN", { align: "center" });

      doc.moveDown(2);

      /* ================= ISI DATA (KOLOM RAPI) ================= */

      const labelX = 80;
      const valueX = 230;
      let rowY = doc.y;
      const rowGap = 18;

      doc.font("Helvetica").fontSize(11);

      doc.text("Nama Pasien", labelX, rowY);
      doc.text(`: ${data.nama}`, valueX, rowY);

      rowY += rowGap;
      doc.text("Tanggal Lahir", labelX, rowY);
      doc.text(`: ${data.tgl_lahir}`, valueX, rowY);

      rowY += rowGap;
      doc.text("Alamat", labelX, rowY);
      doc.text(`: ${data.alamat}`, valueX, rowY, { width: 280 });

      rowY += rowGap * 2;
      doc.text("Tenaga Kesehatan", labelX, rowY);
      doc.text(`: ${data.psikolog}`, valueX, rowY);

      rowY += rowGap;
      doc.text("Jadwal Konsultasi", labelX, rowY);
      doc.text(
        `: ${new Date(data.jadwal).toLocaleString("id-ID")}`,
        valueX,
        rowY
      );

      rowY += rowGap;
      doc.text("Tempat Konsultasi", labelX, rowY);
      doc.text(
        ": RSU Ananda Purwokerto, Jl. Pemuda No.30, Kober, Kec. Purwokerto Bar., Kabupaten Banyumas, Jawa Tengah 53132",
        valueX,
        rowY,
        { width: 280 }
      );

      rowY += rowGap * 3;
      doc.text("Status Rujukan", labelX, rowY);
      doc.text(`: ${statusText}`, valueX, rowY);

      doc.y = rowY + 30;

      /* ================= PARAGRAF KETERANGAN ================= */

      const paragraphX = labelX;       // sama dengan kolom Nama
      const paragraphWidth = 450;      // lebar paragraf rapi A4

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          "Dengan ini pasien tersebut di atas dirujuk untuk mendapatkan pelayanan kesehatan lanjutan sesuai dengan ketentuan yang berlaku.",
          paragraphX,
          doc.y,
          {
            width: paragraphWidth,
            align: "justify"
          }
        );

      doc.moveDown(1);

      doc.text(
        "Surat rujukan ini diterbitkan secara elektronik melalui sistem PENTASOUL dan dinyatakan sah tanpa tanda tangan basah.",
        paragraphX,
        doc.y,
        {
          width: paragraphWidth,
          align: "justify"
        }
      );
      /* ================= TTD (ABSOLUTE POSITION) ================= */

      const ttdX = 360;
      const ttdY = 460;

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          `Purwokerto, ${new Date(data.created_at).toLocaleDateString("id-ID")}`,
          ttdX,
          ttdY
        );

      doc.text("Psikolog Pemeriksa,", ttdX, ttdY + 20);

      doc.image("assets/ttd-psikolog.png", ttdX, ttdY + 45, {
        width: 130
      });

      doc
        .font("Helvetica-Bold")
        .text(data.psikolog, ttdX, ttdY + 125);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Psikolog PENTASOUL", ttdX, ttdY + 140);

      /* ================= QR CODE BANNER ================= */

      const qrPayload = JSON.stringify({
        nama: data.nama,
        status: statusText,
        jadwal: data.jadwal,
        psikolog: data.psikolog
      });

      const qrImage = await QRCode.toDataURL(qrPayload);

      // Posisi banner
      const bannerX = 60;
      const bannerY = 640;
      const bannerWidth = 490;
      const bannerHeight = 90;

      // Background banner
      doc
        .save()
        .roundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 8)
        .fill("#3FA7A3") // warna hijau kebiruan
        .restore();

      // Teks kiri
      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(
          "Tanda Tangan Digital (QR Code)",
          bannerX + 20,
          bannerY + 18
        );

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          "Scan QR Code untuk memverifikasi\nkeaslian dan status surat rujukan\nmelalui sistem PENTASOUL.",
          bannerX + 20,
          bannerY + 38,
          {
            width: 260
          }
        );

      // QR Code kanan
      doc.image(qrImage, bannerX + bannerWidth - 85, bannerY + 15, {
        width: 60
      });

      // Reset warna
      doc.fillColor("black");


      /* ================= FOOTER ================= */
      const footerText =
        "Dokumen ini sah tanpa tanda tangan basah | Sistem PENTASOUL";

      // Hitung posisi footer aman
      const footerY =
        doc.page.height - doc.page.margins.bottom - 20;

      doc
        .fontSize(8)
        .fillColor("gray")
        .text(footerText, 60, footerY, {
          align: "center",
          width: doc.page.width - 120
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

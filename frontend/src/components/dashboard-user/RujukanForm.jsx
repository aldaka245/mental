import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, FileText } from "lucide-react";

export default function RujukanForm() {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tgl_lahir, setTgl_lahir] = useState("");
  const [psikolog, setPsikolog] = useState("");
  const [tempat, setTempat] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const psikologList = ["Kurniasih Dwi P., M.Psi."];

  const tempatList = [
    { name: "RS Ananda Purwokerto" },
    { name: "Biro Psikologi Terapan Sakura Purwokerto" },
  ];

  // Fungsi generate jadwal sesuai tempat (2 minggu ke depan)
  const generateJadwal = (tempat) => {
    const jadwal = [];
    const now = new Date();
    const hariKeDepan = 14; // 2 minggu ke depan

    for (let i = 0; i < hariKeDepan; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const day = d.getDay(); // 0: Minggu, 1: Senin ... 6: Sabtu

      if (tempat === "RS Ananda Purwokerto" && [1, 2, 3, 4].includes(day)) {
        // Senin-Kamis 16:00-18:30
        [16, 17, 18].forEach((h) => {
          const slot = new Date(d);
          slot.setHours(h, 0, 0, 0);
          if (slot > new Date()) jadwal.push(slot);
        });
      }

      if (tempat === "Biro Psikologi Terapan Sakura Purwokerto" && [5, 6].includes(day)) {
        // Jumat-Sabtu 13:00-15:00
        [13, 14, 15].forEach((h) => {
          const slot = new Date(d);
          slot.setHours(h, 0, 0, 0);
          if (slot > new Date()) jadwal.push(slot);
        });
      }
    }

    return jadwal;
  };

  const handleSubmit = async () => {
    if (!nama.trim() || !alamat.trim() || !tgl_lahir || !psikolog || !tempat || !jadwal) {
      alert("Harap isi semua field terlebih dahulu!");
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/rujukan",
        {
          nama: nama.trim(),
          alamat: alamat.trim(),
          tgl_lahir,
          psikolog,
          jadwal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message || "Pengajuan berhasil dikirim!");
      setNama("");
      setAlamat("");
      setTgl_lahir("");
      setPsikolog("");
      setTempat("");
      setJadwal("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal mengajukan rujukan.");
    } finally {
      setLoading(false);
    }
  };

  const currentJadwalList = tempat ? generateJadwal(tempat) : [];

  return (
    <div className="min-h-[75vh] flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#4DB6AC]" />
          <h2 className="text-3xl font-bold text-gray-800">Ajukan Rujukan Psikolog</h2>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Alamat</label>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              value={tgl_lahir}
              onChange={(e) => setTgl_lahir(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          {/* Tempat Konsultasi */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Tempat Konsultasi</label>
            <select
              value={tempat}
              onChange={(e) => { setTempat(e.target.value); setJadwal(""); }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Pilih Tempat</option>
              {tempatList.map((t, idx) => (
                <option key={idx} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Pilih Jadwal */}
          {tempat && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Pilih Jadwal</label>
              <select
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">Pilih Jadwal</option>
                {currentJadwalList.map((j, idx) => (
                  <option key={idx} value={j.toISOString()}>
                    {j.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pilih Psikolog */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Pilih Psikolog</label>
            <select
              value={psikolog}
              onChange={(e) => setPsikolog(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Pilih Psikolog</option>
              {psikologList.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Tombol Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#4DB6AC] to-[#81C784]"}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Kirim Pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
}

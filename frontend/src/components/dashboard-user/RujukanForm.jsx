import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, FileText } from "lucide-react";

export default function RujukanForm() {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tgl_lahir, setTgl_lahir] = useState("");
  const [psikolog, setPsikolog] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const psikologList = [
    "Kurniasih Dwi P., M.Psi."
  ];

  // Fungsi untuk konversi datetime-local ke format MySQL DATETIME
  const formatDatetime = (dtLocal) => {
    if (!dtLocal) return null;
    // Misal input: 2025-12-01T15:30
    return dtLocal.replace("T", " ") + ":00"; // Output: 2025-12-01 15:30:00
  };

  const handleSubmit = async () => {
    // Trim input
    if (!nama.trim() || !alamat.trim() || !tgl_lahir || !psikolog || !jadwal) {
      alert("Harap isi semua field terlebih dahulu!");
      return;
    }

    const jadwalFormatted = formatDatetime(jadwal);
    const tgl_lahirFormatted = tgl_lahir; // sudah YYYY-MM-DD dari input type="date"

    setLoading(true);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token"); // pastikan token login ada
      const res = await axios.post(
        "http://localhost:5000/api/rujukan",
        {
          nama: nama.trim(),
          alamat: alamat.trim(),
          tgl_lahir: tgl_lahirFormatted,
          psikolog: psikolog,
          jadwal: jadwalFormatted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(res.data.message || "Pengajuan berhasil dikirim!");
      // reset form
      setNama("");
      setAlamat("");
      setTgl_lahir("");
      setPsikolog("");
      setJadwal("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || "Gagal mengajukan rujukan.");
    } finally {
      setLoading(false);
    }
  };

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
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Alamat</label>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              value={tgl_lahir}
              onChange={(e) => setTgl_lahir(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

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

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Jadwal Konsultasi</label>
            <input
              type="datetime-local"
              value={jadwal}
              onChange={(e) => setJadwal(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#4DB6AC] to-[#81C784]"
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Kirim Pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
}

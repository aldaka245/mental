import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifikasi() {
  const [aktif, setAktif] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user/notifikasi", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAktif(res.data.notifikasi_aktif === 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleToggle = async () => {
    if (!token) return alert("Silakan login terlebih dahulu");

    try {
      await axios.patch(
        "http://localhost:5000/api/user/notifikasi",
        { notifikasi_aktif: aktif ? 0 : 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAktif(!aktif);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui pengaturan notifikasi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-gray-500">
        Memuat pengaturan notifikasi...
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex justify-center items-start py-14 bg-gradient-to-br from-[#4DB6AC]/20 via-[#81C784]/20 to-[#FFB74D]/20 rounded-3xl">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md p-10 rounded-3xl border border-[#4DB6AC]/20 shadow-lg">

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src="/logo.jpg"
            alt="PentaSoul Logo"
            className="w-24 h-24 rounded-full shadow-md border-2 border-[#81C784]/40"
          />
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] text-transparent bg-clip-text">
            Pengaturan Notifikasi
          </h2>
          <p className="text-gray-600 text-sm">
            Atur preferensi notifikasi sesuai kebutuhanmu
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#E8F5E9] via-[#FFFDE7] to-[#FFF3E0] border border-[#4DB6AC]/30">
          <div>
            <p className="font-semibold text-gray-800">
              Notifikasi Sistem
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {aktif ? "Aktif" : "Nonaktif"}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={aktif}
              onChange={handleToggle}
            />
            <div className="w-16 h-8 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[#4DB6AC] peer-checked:via-[#81C784] peer-checked:to-[#FFB74D] transition-all"></div>
            <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-8"></span>
          </label>
        </div>

        {/* Status */}
        <div className="text-center mt-8">
          {aktif ? (
            <p className="text-[#4DB6AC] font-semibold text-sm">
              🔔 Notifikasi aktif — kamu akan menerima pembaruan sistem
            </p>
          ) : (
            <p className="text-gray-500 font-medium text-sm">
              🔕 Notifikasi nonaktif — kamu tidak akan menerima notifikasi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

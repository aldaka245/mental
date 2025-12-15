import { useEffect, useState } from "react";
import axios from "axios";

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user/riwayat", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRiwayat(res.data))
      .catch((err) => console.error("Gagal memuat riwayat:", err))
      .finally(() => setLoading(false));
  }, []);

  const groupedRiwayat = riwayat.reduce((acc, item) => {
  const dateKey = new Date(item.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!acc[dateKey]) acc[dateKey] = [];
  acc[dateKey].push(item);

  return acc;
}, {});


  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center py-10 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <img
          src="/logo.jpg"
          alt="Logo PentaSoul"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] text-transparent bg-clip-text">
          Riwayat Diagnosa
        </h2>
        <p className="text-gray-600 text-sm">
          Catatan hasil diagnosa kesehatan mental Anda 🧠
        </p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-10 h-10 border-4 border-[#4DB6AC] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : riwayat.length === 0 ? (
        <div className="text-center bg-gray-50 py-8 px-6 rounded-2xl shadow-inner text-gray-500 font-medium">
          Belum ada riwayat diagnosa.
        </div>
      ) : (
        <div className="w-full max-w-5xl space-y-8 animate-fadeInSlow">
  {Object.entries(groupedRiwayat).map(([tanggal, items], index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header Tanggal */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#4DB6AC]/20 via-[#81C784]/20 to-[#FFB74D]/20">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          📅 {tanggal}
        </h3>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="px-6 py-3 text-left border-b">
                Waktu
              </th>
              <th className="px-6 py-3 text-left border-b">
                Hasil Diagnosa
              </th>
              <th className="px-6 py-3 text-left border-b">
                Level
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#4DB6AC]/5 transition"
              >
                <td className="px-6 py-3 border-b text-gray-600">
                  {new Date(r.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-3 border-b font-medium text-gray-800">
                  {r.hasil}
                </td>
                <td
                  className={`px-6 py-3 border-b font-semibold ${
                    r.level === "Tinggi"
                      ? "text-red-600"
                      : r.level === "Sedang"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {r.level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
}
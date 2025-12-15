import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Clock, CheckCircle } from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState({ name: "" });
  const [stats, setStats] = useState({
    riwayat: 0,
    notifikasi: false,
    terakhir: "Belum ada",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, riwayatRes, notifRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/user/profile", { headers }),
          axios.get("http://localhost:5000/api/user/riwayat", { headers }),
          axios.get("http://localhost:5000/api/user/notifikasi", { headers }),
        ]);

        if (profileRes.status === "fulfilled") setUser(profileRes.value.data);

        if (riwayatRes.status === "fulfilled") {
          const data = riwayatRes.value.data;
          setStats((prev) => ({
            ...prev,
            riwayat: data.length,
            terakhir:
              data.length > 0
                ? new Date(data[data.length - 1].created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Belum ada",
          }));
        }

        if (notifRes.status === "fulfilled") {
          setStats((prev) => ({
            ...prev,
            notifikasi: notifRes.value.data.aktif === 1,
          }));
        }
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-[80vh] w-full space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 mt-6">
        <img
          src="/logo.jpg"
          alt="Logo PentaSoul"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#C8102E] to-[#0033A0] text-transparent bg-clip-text">
          Selamat Datang, {user.name || "User"} 👋
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Kelola kesehatan mentalmu dengan mudah. Lihat riwayat diagnosa,
          atur notifikasi, dan perbarui profil dalam satu tempat.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Riwayat Card */}
          <div className="bg-white shadow-sm hover:shadow-md rounded-2xl p-8 text-center border border-[#C8102E]/20 hover:border-[#C8102E]/40 transition-all duration-300">
            <CheckCircle className="w-12 h-12 text-[#C8102E] mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold">Jumlah Riwayat</h3>
            <p className="text-4xl font-extrabold text-[#C8102E] mt-2">
              {stats.riwayat}
            </p>
          </div>

          {/* Notifikasi Card */}
          <div className="bg-white shadow-sm hover:shadow-md rounded-2xl p-8 text-center border border-[#0033A0]/20 hover:border-[#0033A0]/40 transition-all duration-300">
            <Bell className="w-12 h-12 text-[#0033A0] mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold">Notifikasi Aktif</h3>
            <p
              className={`text-3xl font-bold mt-2 ${
                stats.notifikasi ? "text-[#0033A0]" : "text-gray-400"
              }`}
            >
              {stats.notifikasi ? "Ya" : "Tidak"}
            </p>
          </div>

          {/* Pemeriksaan Card */}
          <div className="bg-white shadow-sm hover:shadow-md rounded-2xl p-8 text-center border border-yellow-200 hover:border-yellow-400 transition-all duration-300">
            <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold">Pemeriksaan Terakhir</h3>
            <p className="text-lg font-semibold text-yellow-600 mt-2">
              {stats.terakhir}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

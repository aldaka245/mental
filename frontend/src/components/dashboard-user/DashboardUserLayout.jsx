import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, User, Clock, Menu, LogOut, Bell, MessageCircle } from "lucide-react";
import axios from "axios";

export default function DashboardUserLayout() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState({ name: "", foto: null });
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const [waOpen, setWaOpen] = useState(false);

  // Tutup popup notifikasi kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ambil data user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: res.data.username, foto: res.data.foto });
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Beranda", path: "/dashboard-user", icon: <Home className="w-5 h-5" /> },
    { name: "Cek Kesehatan Mental", path: "/dashboard-user/cek", icon: <FileText className="w-5 h-5" /> },
    { name: "Profil", path: "/dashboard-user/profil", icon: <User className="w-5 h-5" /> },
    { name: "Riwayat", path: "/dashboard-user/riwayat", icon: <Clock className="w-5 h-5" /> },
    { name: "Ajukan Rujukan", path: "/dashboard-user/rujukan", icon: <FileText className="w-5 h-5" /> },
    { name: "Status Rujukan", path: "/dashboard-user/status-rujukan", icon: <Clock className="w-5 h-5" /> },
  ];

  const dummyNotifs = [
    { id: 1, text: "📢 Pemeriksaan mental baru telah tersedia!" },
    { id: 2, text: "💬 Kamu punya 2 pesan belum dibaca." },
    { id: 3, text: "🧠 Reminder: Tes mingguan dimulai besok!" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-gray-800 relative overflow-visible">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-500 ease-in-out shadow-sm ${open ? "w-64" : "w-20"
          } flex flex-col z-40`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {open && <h2 className="font-bold text-xl text-[#4DB6AC] tracking-wide select-none">PentaSoul</h2>}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-[#4DB6AC]/10 text-gray-500 transition"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-4 flex-grow px-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                    ? "bg-[#4DB6AC] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#4DB6AC]/10 hover:text-[#4DB6AC]"
                  }`}
              >
                {item.icon}
                {open && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            {open && <span>Logout</span>}
          </button>
        </div>

        <div className="text-center text-[11px] text-gray-400 pb-4">
          © {new Date().getFullYear()} PentaSoul
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col relative z-30">
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white shadow-sm relative z-30">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
            Dashboard Pengguna
          </h1>

          <div className="flex items-center gap-4 relative" ref={notifRef}>
            {/* Notifikasi */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-full hover:bg-[#4DB6AC]/10 transition"
            >
              <Bell className="w-6 h-6 text-[#4DB6AC]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB74D] rounded-full"></span>
            </button>

            {notifOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-xl rounded-2xl w-72 z-50 animate-fadeIn">
                <div className="p-3 border-b text-sm font-semibold text-gray-700 bg-gray-50 rounded-t-2xl">
                  Notifikasi
                </div>
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {dummyNotifs.map((notif) => (
                    <li
                      key={notif.id}
                      className="px-4 py-3 hover:bg-[#4DB6AC]/10 text-sm text-gray-700 transition cursor-pointer"
                    >
                      {notif.text}
                    </li>
                  ))}
                </ul>
                <div className="text-center text-xs text-gray-500 py-2 border-t bg-gray-50">
                  Lihat semua notifikasi
                </div>
              </div>
            )}

            {/* Profil user */}
            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-1.5 border border-[#4DB6AC]/30 hover:shadow transition">
              {user.foto ? (
                <img
                  src={
                    user.foto.startsWith("http")
                      ? user.foto
                      : `http://localhost:5000${user.foto}`
                  }
                  alt="Foto User"
                  className="w-9 h-9 rounded-full object-cover border border-[#81C784]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-[#81C784]">
                  U
                </div>
              )}
              <span className="font-medium text-gray-700 text-sm">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 min-h-[70vh] relative">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating WhatsApp Bubble */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Popup pilihan admin */}
        {waOpen && (
          <div className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-200 w-56 animate-fadeIn">
            <div className="p-3 border-b text-sm font-semibold text-gray-700 bg-gray-50 rounded-t-2xl">
              Hubungi Admin
            </div>

            <button
              onClick={() => {
                const url = "https://wa.me/6281229899055?text=Halo Admin 1, saya ingin bertanya";
                window.open(url, "_blank");
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#4DB6AC]/10 text-sm text-gray-700 transition"
            >
              👤 Biro Psikologi
            </button>

            <button
              onClick={() => {
                const url = "https://wa.me/6285726515107?text=Halo Admin 2, saya ingin bertanya";
                window.open(url, "_blank");
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#4DB6AC]/10 text-sm text-gray-700 transition"
            >
              👤 RS Ananda
            </button>
          </div>
        )}

        {/* Bubble utama */}
        <button
          onClick={() => setWaOpen(!waOpen)}
          className="bg-[#4DB6AC] hover:bg-[#81C784] text-white p-4 rounded-full shadow-lg transition duration-300"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}

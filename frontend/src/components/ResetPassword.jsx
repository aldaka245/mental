import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
    if (!resetToken) {
      alert("Token tidak ditemukan atau link tidak valid.");
      navigate("/login");
    } else {
      setToken(resetToken);
    }
  }, [location, navigate]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      alert("Isi semua kolom password!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      });

      alert(res.data.message || "Password berhasil direset. Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Gagal mereset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradasi bergerak */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-300 to-orange-300 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Card Form */}
      <div
        className={`relative bg-white/90 shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md border-t-4 border-orange-400 transform transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.jpg"
            alt="PentaSoul Logo"
            className="w-28 h-28 mb-3 rounded-full shadow-md"
          />
          <h2 className="text-3xl font-extrabold text-gray-800 text-center tracking-tight">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Masukkan kata sandi baru untuk akunmu.
          </p>
        </div>

        {/* Form Input */}
        <div className="space-y-4 mt-4">
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 hover:shadow-md"
          />
          <input
            type="password"
            placeholder="Konfirmasi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 hover:shadow-md"
          />

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 via-green-400 to-orange-400 text-white hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-5">
          Kembali ke{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Halaman Login
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} PerkakGank — All rights reserved.
        </p>
      </div>

      {/* Animasi background */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </div>
  );
}

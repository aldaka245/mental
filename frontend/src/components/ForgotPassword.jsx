import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Masukkan email terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      alert(res.data.message || "Link reset password telah dikirim ke email kamu!");
      setEmail("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Gagal mengirim email reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 via-green-200 to-orange-200">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md border-t-4 border-orange-400">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="PentaSoul Logo" className="w-40 h-40 mb-2" />
          <h2 className="text-2xl font-extrabold text-gray-800 text-center">
            Lupa Password
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Masukkan email yang terdaftar untuk menerima link reset password.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 via-green-400 to-orange-400 hover:from-blue-600 hover:via-green-500 hover:to-orange-500"
            } text-white py-2 rounded-lg font-semibold transition duration-300 shadow-md`}
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </div>

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
    </div>
  );
}

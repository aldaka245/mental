import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Masukkan email yang valid!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
        role: "user",
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Gagal register");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradasi bergerak */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-300 to-orange-300 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
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
            Buat Akun Baru
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Daftar untuk mulai menggunakan{" "}
            <span className="font-semibold text-green-600">PentaSoul</span>
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mt-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 hover:shadow-md"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 hover:shadow-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 hover:shadow-md"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-green-400 to-orange-400 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Register
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-5">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login sekarang
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} PerkakGank — All rights reserved.
        </p>
      </form>

      {/* Keyframes background animation */}
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

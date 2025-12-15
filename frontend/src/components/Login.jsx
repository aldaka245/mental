import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role || "user");

      if (res.data.role === "admin") navigate("/dashboard-admin");
      else navigate("/dashboard-user");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradient bergerak */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-300 to-orange-300 animate-gradient-x"></div>

      {/* Overlay efek blur ringan */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Card Login */}
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
            Selamat Datang
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Masuk ke sistem <span className="font-semibold text-green-600">PentaSoul</span>
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 mt-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300 hover:shadow-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 hover:shadow-md"
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 via-green-400 to-orange-400 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-5">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Daftar disini
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} PerkakGank — All rights reserved.
        </p>
      </div>

      {/* Animasi background keyframes */}
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

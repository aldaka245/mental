import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// User Dashboard
import DashboardUserLayout from "./components/dashboard-user/DashboardUserLayout";
import UserDashboard from "./components/dashboard-user/UserDashboard";
import UserForm from "./components/dashboard-user/UserForm";
import ProfilUser from "./components/dashboard-user/ProfilUser";
import Notifikasi from "./components/dashboard-user/Notifikasi";
import Riwayat from "./components/dashboard-user/Riwayat";
import Rujukan from "./components/dashboard-user/RujukanForm";
import StatusRujukan from "./components/dashboard-user/StatusRujukan";

// Admin Dashboard
import AdminDashboard from "./components/AdminDashboard";

// ProtectedRoute component
function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (roleRequired && role !== roleRequired)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Anda tidak memiliki akses ke halaman ini.
      </p>
    );

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Utama */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Tambahkan ini */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Tambahkan ini */}

        {/* Dashboard User */}
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute roleRequired="user">
              <DashboardUserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="cek" element={<UserForm />} />
          <Route path="profil" element={<ProfilUser />} />
          <Route path="notifikasi" element={<Notifikasi />} />
          <Route path="riwayat" element={<Riwayat />} />
          <Route path="rujukan" element={<Rujukan />} />
          <Route path="status-rujukan" element={<StatusRujukan />} />
        </Route>

        {/* Dashboard Admin */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-screen text-center">
              <h1 className="text-5xl font-bold text-[#C8102E] mb-4">404</h1>
              <p className="text-gray-600 mb-6">Halaman tidak ditemukan</p>
              <a
                href="/"
                className="px-5 py-2 bg-[#C8102E] text-white rounded-lg hover:bg-[#0033A0] transition"
              >
                Kembali ke Beranda
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

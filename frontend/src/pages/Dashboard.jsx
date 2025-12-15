import { useEffect, useState } from "react";
import UserForm from "../components/dashboard-user/UserForm";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch {
      setRole(null);
    }
  }, []);

  if (!role) return <div className="text-center mt-20">Loading...</div>;

  return <div>{role === "admin" ? <AdminDashboard /> : <UserForm />}</div>;
}

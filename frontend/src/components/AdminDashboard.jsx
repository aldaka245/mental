import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Users,
  Upload,
  Database,
  MessageSquare,
  LogOut,
  FileDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [stats, setStats] = useState({ users: 0, pertanyaan: 0, riwayat: 0 });
  const [userTrend, setUserTrend] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [hasilChart, setHasilChart] = useState([]);
  const [kasusTrend, setKasusTrend] = useState([]);
  const [userList, setUserList] = useState([]);
  const [rujukanList, setRujukanList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [previewData, setPreviewData] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const reportRef = useRef();
  const navigate = useNavigate();
  const rawToken = localStorage.getItem("token") || null;

  const getAuthHeaders = () => {
    if (!rawToken) return {};
    return {
      Authorization: rawToken.startsWith("Bearer ")
        ? rawToken
        : `Bearer ${rawToken}`,
    };
  };

  useEffect(() => {
    if (!rawToken) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
    fetchRiwayat();
    fetchRujukan();
  }, [rawToken]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ====================== FETCH DATA ======================
  const fetchDashboardData = async () => {
    try {
      const headers = { headers: getAuthHeaders() };
      const [statsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", headers),
        axios.get("http://localhost:5000/api/admin/users", headers),
      ]);

      const statsData = statsRes.data || {};
      setStats({
        users: statsData.total_users ?? 0,
        pertanyaan: statsData.total_pertanyaan ?? 0,
        riwayat: statsData.total_riwayat ?? 0,
      });

      const users = usersRes.data?.users || [];
      setUserList(
        users.map((u, i) => ({
          username: u.username ?? `User-${i + 1}`,
          total: 1,
        }))
      );

      const userByWeek = {};
      users.forEach((u) => {
        const date = new Date(u.created_at);
        const weekLabel = `M-${getWeekOfMonth(date)}`;
        userByWeek[weekLabel] = (userByWeek[weekLabel] || 0) + 1;
      });

      setUserTrend(
        Object.entries(userByWeek).map(([week, count]) => ({
          week,
          users: count,
        }))
      );
    } catch (err) {
      console.error("Error fetchDashboardData:", err);
      if (err.response?.status === 401 || err.response?.status === 403) logout();
    }
  };

  const fetchRiwayat = async (month = selectedMonth) => {
    try {
      const headers = { headers: getAuthHeaders() };
      const res = await axios.get(
        "http://localhost:5000/api/admin/riwayat-pemeriksaan",
        headers
      );

      const mapped = (res.data || []).map((r) => ({
        id: r.id ?? Math.random(),
        user_name: r.nama_user ?? "-",
        hasil: r.hasil_diagnosa ?? "-",
        created_at: r.created_at ?? new Date().toISOString(),
      }));

      let filtered = mapped;
      if (month) {
        filtered = mapped.filter((r) => {
          const date = new Date(r.created_at);
          return (
            date.getMonth() === month.getMonth() &&
            date.getFullYear() === month.getFullYear()
          );
        });
      }

      setRiwayat(filtered);

      const countByHasil = {};
      filtered.forEach((r) => {
        countByHasil[r.hasil] = (countByHasil[r.hasil] || 0) + 1;
      });

      setHasilChart(
        Object.entries(countByHasil).map(([hasil, total]) => ({
          hasil,
          total,
        }))
      );

      const kasusByMonth = {};
      mapped.forEach((r) => {
        const d = new Date(r.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        kasusByMonth[key] = (kasusByMonth[key] || 0) + 1;
      });

      setKasusTrend(
        Object.entries(kasusByMonth).map(([bulan, total]) => ({
          bulan,
          total,
        }))
      );
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
      if (err.response?.status === 401 || err.response?.status === 403) logout();
    }
  };

  const fetchRujukan = async () => {
    try {
      const headers = { headers: getAuthHeaders() };
      const res = await axios.get(
        "http://localhost:5000/api/admin/rujukan",
        headers
      );
      setRujukanList(res.data || []);
    } catch (err) {
      console.error("Gagal fetch rujukan:", err);
    }
  };

  // ====================== ACTION BUTTONS ======================
  const handleAcc = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/rujukan/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Berhasil di-ACC");
      fetchRujukan();
    } catch (err) {
      console.error(err);
      alert("Gagal ACC rujukan");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/rujukan/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Berhasil ditolak");
      fetchRujukan();
    } catch (err) {
      console.error(err);
      alert("Gagal menolak rujukan");
    }
  };

  // ====================== UPLOAD CSV ======================
  const handleUpload = async () => {
    if (!file) return alert("Pilih file CSV dulu!");
    const formData = new FormData();
    formData.append("dataset", file);

    try {
      const headers = {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/admin/upload-dataset",
        formData,
        headers
      );

      alert(res.data.message || "Dataset berhasil diupload");

      setFile(null);
      fetchDashboardData();
      fetchRiwayat();
      fetchPreviewDataset();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Gagal upload dataset");
    }
  };

  // ====================== EXPORT PDF ======================
  const handleExportPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Laporan-PentaSoul.pdf");
  };

  // ====================== EXPORT EXCEL ======================
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet([
      { Kategori: "Total User", Jumlah: stats.users },
      { Kategori: "Total Pertanyaan", Jumlah: stats.pertanyaan },
      { Kategori: "Total Riwayat", Jumlah: stats.riwayat },
    ]);
    const ws2 = XLSX.utils.json_to_sheet(riwayat);
    const ws3 = XLSX.utils.json_to_sheet(rujukanList);

    XLSX.utils.book_append_sheet(wb, ws1, "Statistik");
    XLSX.utils.book_append_sheet(wb, ws2, "Riwayat Pemeriksaan");
    XLSX.utils.book_append_sheet(wb, ws3, "Rujukan Psikolog");

    XLSX.writeFile(wb, "Laporan-PentaSoul.xlsx");
  };

  const fetchPreviewDataset = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/dataset-preview", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setPreviewData(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingPreview(false);
  };

  const handleDeleteDataset = async () => {
    if (!window.confirm("Yakin ingin menghapus seluruh dataset?")) return;

    await fetch("http://localhost:5000/api/admin/delete-dataset", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setPreviewData([]);
  };


  // ====================== RENDER ======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-orange-100 pb-16">
      {/* HEADER */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" className="w-12 h-12 object-contain" alt="Logo" />
          <h1 className="text-xl font-bold text-gray-800">
            Admin Dashboard — PentaSoul
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90"
          >
            <FileDown size={18} /> Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:opacity-90"
          >
            <FileDown size={18} /> Export Excel
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-green-400 to-orange-400 hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-7xl mx-auto mt-8 px-4 flex gap-4">
        <TabButton
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
          label="Dashboard"
        />
        <TabButton
          active={activeTab === "upload"}
          onClick={() => setActiveTab("upload")}
          label="Upload Dataset"
        />
        <TabButton
          active={activeTab === "riwayat"}
          onClick={() => setActiveTab("riwayat")}
          label="Riwayat Pemeriksaan"
        />
        <TabButton
          active={activeTab === "rujukan"}
          onClick={() => setActiveTab("rujukan")}
          label="Rujukan Psikolog"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto space-y-10 mt-6 px-4" ref={reportRef}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<Users />}
                label="Total User"
                value={stats.users}
                color="from-blue-400 to-blue-600"
              />
              <StatCard
                icon={<MessageSquare />}
                label="Total Pertanyaan"
                value={stats.pertanyaan}
                color="from-green-400 to-green-600"
              />
              <StatCard
                icon={<Database />}
                label="Total Riwayat"
                value={stats.riwayat}
                color="from-orange-400 to-orange-600"
              />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <ChartCard title="Jumlah User per Minggu">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={userTrend}>
                    <CartesianGrid stroke="#ddd" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="users"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>


              {hasilChart.length > 0 && (
                <ChartCard title="Distribusi Hasil Pemeriksaan">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={hasilChart}>
                      <CartesianGrid stroke="#ddd" />
                      <XAxis dataKey="hasil" />
                      <YAxis />
                      <Tooltip />

                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {hasilChart.map((entry, i) => {
                          const colors = [
                            "#60a5fa",
                            "#34d399",
                            "#fbbf24",
                            "#f87171",
                            "#a78bfa",
                          ];
                          return (
                            <Cell
                              key={i}
                              fill={colors[i % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {userList.length > 0 && (
                <ChartCard title="Daftar Username yang Sudah Mendaftar">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userList.slice(0, 10)}>
                      <CartesianGrid stroke="#ddd" />
                      <XAxis dataKey="username" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <p className="text-sm text-gray-500 mt-2">
                    Menampilkan 10 username pertama
                  </p>
                </ChartCard>
              )}
            </div>
          </>
        )}

        {/* UPLOAD DATASET */}
        {activeTab === "upload" && (
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-300">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              Upload Dataset
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="border p-2 rounded-lg"
              />
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Upload size={18} /> Upload Dataset
              </button>
            </div>

            {/* PREVIEW DATASET */}
            {loadingPreview && (
              <p className="text-sm text-gray-500">Memuat preview dataset...</p>
            )}

            {previewData.length > 0 && (
              <div className="mt-5 bg-gray-50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">
                    Preview Dataset (10 Data)
                  </h4>
                  <button
                    onClick={handleDeleteDataset}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                  >
                    Hapus Dataset
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border">Pertanyaan</th>
                        <th className="p-2 border">Kode</th>
                        <th className="p-2 border">Gejala</th>
                        <th className="p-2 border">Penyakit</th>
                        <th className="p-2 border">CF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="bg-white">
                          <td className="p-2 border">{row.pertanyaan}</td>
                          <td className="p-2 border">{row.kode_gejala}</td>
                          <td className="p-2 border">{row.nama_gejala}</td>
                          <td className="p-2 border">{row.penyakit}</td>
                          <td className="p-2 border">{row.cf_pakar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}


        {/* RIWAYAT PEMERIKSAAN */}
        {activeTab === "riwayat" && (
          <>
            <div className="flex justify-end mb-4">
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => {
                  setSelectedMonth(date);
                  fetchRiwayat(date);
                }}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Pilih Bulan"
                className="border rounded-lg px-3 py-2 w-48"
              />
            </div>

            {riwayat.length > 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-300">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">
                  Riwayat Pemeriksaan User
                </h3>

                <div className="overflow-auto max-h-80">
                  <table className="w-full text-sm border">
                    <thead className="bg-gradient-to-r from-orange-100 to-yellow-100 text-gray-700">
                      <tr>
                        <th className="p-2 border">No</th>
                        <th className="p-2 border">Nama User</th>
                        <th className="p-2 border">Hasil Diagnosa</th>
                        <th className="p-2 border">Tanggal Pemeriksaan</th>
                      </tr>
                    </thead>

                    <tbody>
                      {riwayat.map((r, i) => (
                        <tr
                          key={r.id ?? i}
                          className="hover:bg-orange-50 transition"
                        >
                          <td className="p-2 border text-center">{i + 1}</td>
                          <td className="p-2 border">{r.user_name}</td>
                          <td className="p-2 border text-center">
                            {r.hasil}
                          </td>
                          <td className="p-2 border text-center">
                            {new Date(r.created_at).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Tidak ada riwayat pemeriksaan
              </p>
            )}
          </>
        )}

        {/* RUJUKAN */}
        {activeTab === "rujukan" && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-300">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              Pengajuan Rujukan Psikolog
            </h3>

            <div className="overflow-auto max-h-80">
              <table className="w-full text-sm border">
                <thead className="bg-green-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">User</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Psikolog</th>
                    <th className="p-2 border">Jadwal</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {rujukanList.map((item, i) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 border text-center">{i + 1}</td>
                      <td className="p-2 border">{item.username}</td>
                      <td className="p-2 border">{item.nama}</td>
                      <td className="p-2 border">{item.psikolog}</td>
                      <td className="p-2 border">
                        {new Date(item.jadwal).toLocaleString("id-ID")}
                      </td>

                      <td className="p-2 border text-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-white ${item.status === "pending"
                            ? "bg-yellow-500"
                            : item.status === "approved"
                              ? "bg-green-600"
                              : "bg-red-600"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-2 border flex gap-2 justify-center">
                        <button
                          onClick={() => handleAcc(item.id)}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                        >
                          ACC
                        </button>

                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================== COMPONENTS ======================
function StatCard({ icon, label, value, color }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-md text-white flex items-center gap-4`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="font-semibold text-lg">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-300">
      <h3 className="font-semibold text-lg mb-3 text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold ${active ? "bg-blue-500 text-white" : "bg-white shadow"
        }`}
    >
      {label}
    </button>
  );
}

// ====================== UTILS ======================
function getWeekOfMonth(date) {
  const startWeekDayIndex = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  return Math.ceil((date.getDate() + startWeekDayIndex) / 7);
}

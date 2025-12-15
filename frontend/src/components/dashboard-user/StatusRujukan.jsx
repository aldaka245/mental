import { useEffect, useState } from "react";
import axios from "axios";

export default function StatusRujukan() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/rujukan", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching rujukan:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-600";
        }

    };

    const handleDownload = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `http://localhost:5000/api/rujukan/${id}/download`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `surat-rujukan-${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Gagal download PDF:", err);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Status Pengajuan Rujukan
            </h2>

            {loading ? (
                <p className="text-gray-600">Memuat data...</p>
            ) : data.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">Belum ada pengajuan rujukan.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 border-b">
                                <th className="p-3">Nama</th>
                                <th className="p-3">Psikolog</th>
                                <th className="p-3">Jadwal</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{item.nama}</td>
                                    <td className="p-3">{item.psikolog}</td>
                                    <td className="p-3">
                                        {new Date(item.jadwal).toLocaleString()}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDownload(item.id)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                                        >
                                            Download Surat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

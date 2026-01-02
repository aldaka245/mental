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
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-3 border-b text-center">Nama</th>
                                <th className="p-3 border-b text-center">Psikolog</th>
                                <th className="p-3 border-b text-center">Jadwal</th>
                                <th className="p-3 border-b text-center">Status</th>
                                <th className="p-3 border-b text-center">Catatan Admin</th>
                                <th className="p-3 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b text-left">{item.nama}</td>
                                    <td className="p-3 border-b text-left">{item.psikolog}</td>
                                    <td className="p-3 border-b text-left">
                                        {new Date(item.jadwal).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-3 border-b text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b text-left">
                                        {item.catatan_admin ? (
                                            <div className="bg-gray-50 border rounded-lg p-2 text-xs text-gray-700 whitespace-pre-line">
                                                {item.catatan_admin}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">
                                                Belum ada catatan
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center">
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

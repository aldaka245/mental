import { useEffect, useState } from "react";
import axios from "axios";

export default function UserForm() {
  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);

  const skala = [
    { value: 1, label: "Sangat Tidak Merasa" },
    { value: 2, label: "Jarang" },
    { value: 3, label: "Kadang-kadang" },
    { value: 4, label: "Sering" },
    { value: 5, label: "Sangat Sering" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user/pertanyaan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPertanyaan(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id, val) =>
    setJawaban((prev) => ({ ...prev, [id]: Number(val) }));

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Silakan login dulu");

    for (let q of pertanyaan) {
      if (!jawaban[q.id]) return alert("Harap isi semua pertanyaan!");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/cek-mental",
        jawaban,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasil(res.data.hasil);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim jawaban");
    }
  };

  const progress =
    pertanyaan.length > 0
      ? (Object.keys(jawaban).length / pertanyaan.length) * 100
      : 0;

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center py-10 space-y-10 animate-fadeIn">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 mt-4">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-24 h-24 mb-2 drop-shadow-md rounded-full"
        />
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D]">
          Cek Kesehatan Mental
        </h2>
        <p className="text-gray-600 text-center max-w-2xl">
          Jawab pertanyaan berikut untuk mengetahui kondisi mentalmu selama sebulan terakhir.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#4DB6AC] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Daftar Pertanyaan */}
          <div className="w-full max-w-5xl space-y-6">
            {pertanyaan.map((q, i) => {
              const bgColors = [
                "from-[#E0F2F1] to-[#F1F8E9]",
                "from-[#FFFDE7] to-[#FFF8E1]",
                "from-[#FBE9E7] to-[#FFF3E0]",
                "from-[#E3F2FD] to-[#E8F5E9]",
              ];
              const color = bgColors[i % bgColors.length];

              return (
                <div
                  key={q.id}
                  className={`bg-gradient-to-b ${color} border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 duration-300`}
                >
                  <label className="mb-4 block font-semibold text-gray-900 text-lg">
                    {q.teks_pertanyaan}
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {skala.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => handleChange(q.id, s.value)}
                        className={`p-3 rounded-xl text-sm font-medium border-2 transition duration-200
                          ${jawaban[q.id] === s.value
                            ? "bg-[#4DB6AC] border-[#4DB6AC] text-white shadow-md"
                            : "bg-white border-gray-300 hover:bg-[#E0F2F1] hover:border-[#4DB6AC]/50 text-gray-700"
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Submit */}
          {pertanyaan.length > 0 && (
            <button
              onClick={handleSubmit}
              className="mt-10 w-full max-w-5xl bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] text-white py-3 rounded-2xl text-lg font-semibold shadow-md hover:opacity-90 transition duration-300"
            >
              Submit Jawaban
            </button>
          )}

          {/* Hasil Diagnosa */}
          {hasil.length > 0 && (
            <div className="w-full max-w-5xl bg-white rounded-2xl border border-[#81C784]/40 shadow-sm p-6 mt-10">
              <h3 className="font-extrabold text-2xl mb-4 text-center text-[#4DB6AC]">
                Hasil Diagnosa
              </h3>
              <table className="table-auto border-collapse w-full text-center">
                <thead>
                  <tr className="bg-gradient-to-r from-[#4DB6AC]/20 via-[#81C784]/20 to-[#FFB74D]/20">
                    <th className="border px-3 py-2 font-semibold text-[#4DB6AC]">
                      Penyakit
                    </th>
                    <th className="border px-3 py-2 font-semibold text-[#81C784]">
                      Level
                    </th>
                    <th className="border px-3 py-2 font-semibold text-[#FFB74D]">
                      Solusi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((h, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-[#E8F5E9] transition duration-200"
                    >
                      <td className="border px-3 py-2">{h.penyakit}</td>
                      <td className="border px-3 py-2 text-[#81C784] font-semibold">
                        {h.level}
                      </td>
                      <td className="border px-3 py-2">{h.solusi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

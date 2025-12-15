import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

export default function Home() {
  const [quote, setQuote] = useState("");

  const quotes = [
    "Jangan takut gagal, takutlah jika kamu tidak mencoba.",
    "Ketenangan datang dari hati yang menerima.",
    "Hidup bukan tentang menunggu badai reda, tapi belajar menari di tengah hujan.",
    "Pikiran yang tenang adalah pondasi dari jiwa yang kuat.",
    "Senyum kecil hari ini bisa menyelamatkan hatimu dari badai esok hari.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Data chart dummy (bisa disesuaikan dari API nantinya)
  const data = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Pengguna yang Selesai Tes",
        data: [12, 19, 9, 15, 22, 18, 25],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-200 via-green-200 to-blue-200 text-gray-800 px-6">
      {/* Logo dan Judul */}
      <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
        <img
          src="/logo.jpg"
          alt="Logo PentaSoul"
          className="w-32 h-32 mb-2 drop-shadow-xl rounded-full border-4 border-white shadow-md"
        />

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-green-600 to-blue-600 drop-shadow-sm">
          Selamat Datang di Sistem PentaSoul
        </h1>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed">
          Temukan keseimbangan mental Anda melalui sistem diagnosa cerdas berbasis pertanyaan.
          Jawab dengan jujur, dan kami bantu memahami kondisi emosional Anda 🌿
        </p>
      </div>

      {/* Chart Section */}
      <div className="mt-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-center text-xl font-semibold text-green-700 mb-3">
          Aktivitas Mingguan Pengguna
        </h2>
        <Line data={data} options={options} />
        <p className="text-sm text-gray-600 text-center mt-3 italic">
          Data ini menunjukkan jumlah pengguna yang menyelesaikan tes tiap harinya.
        </p>
      </div>

      {/* Quote motivasi */}
      <div className="mt-10 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md text-center max-w-md">
        <p className="text-gray-700 font-medium italic">“{quote}”</p>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <Link
          to="/login"
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Masuk Sekarang
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Daftar Akun Baru
        </Link>
      </div>

      {/* Footer kecil */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>
          “Kesehatan mental sama pentingnya dengan kesehatan fisik — mulai peduli dari sekarang.”
        </p>
        <p className="mt-2 text-gray-500">
          © 2025 PerkakGank | All Rights Reserved
        </p>
      </div>
    </div>
  );
}

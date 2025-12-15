import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilUser() {
  const [username, setUsername] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.username);
        if (res.data.foto) {
          const fotoUrl = res.data.foto.startsWith("http")
            ? res.data.foto
            : `http://localhost:5000${res.data.foto}`;
          setPreview(fotoUrl);
        }
      })
      .catch((err) => console.error("Gagal memuat profil:", err));
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Silakan login terlebih dahulu.");

    const formData = new FormData();
    formData.append("username", username);
    if (foto) formData.append("foto", foto);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Profil berhasil diperbarui!");

      if (res.data.foto) {
        const fotoUrl = res.data.foto.startsWith("http")
          ? res.data.foto
          : `http://localhost:5000${res.data.foto}`;
        setPreview(fotoUrl);
      }
    } catch (err) {
      console.error("Error update profil:", err.response?.data || err);
      alert(err.response?.data?.error || "Gagal memperbarui profil");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-10 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <img
          src="/logo.jpg"
          alt="PentaSoul Logo"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] text-transparent bg-clip-text">
          Edit Profil
        </h2>
        <p className="text-gray-600 text-sm">
          Perbarui informasi akunmu agar tetap up-to-date ✨
        </p>
      </div>

      {/* Form Profil */}
      <div className="w-full max-w-lg flex flex-col items-center gap-8">
        {/* Foto Profil */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full border-[3px] border-transparent bg-gradient-to-tr from-[#4DB6AC] via-[#81C784] to-[#FFB74D] p-[3px] shadow-md">
            <div className="rounded-full overflow-hidden bg-white w-full h-full">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview Foto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                  Foto
                </div>
              )}
            </div>
          </div>

          <label className="cursor-pointer text-sm font-medium text-gray-700 hover:text-[#4DB6AC] transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
            Ubah Foto Profil
          </label>
        </div>

        {/* Input Username */}
        <div className="w-full space-y-1">
          <label className="block text-sm font-medium text-gray-600">
            Nama Pengguna
          </label>
          <input
            type="text"
            placeholder="Masukkan nama pengguna"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none text-gray-800 shadow-sm transition"
          />
        </div>

        {/* Tombol Simpan */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#4DB6AC] via-[#81C784] to-[#FFB74D] text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:opacity-95 transition duration-300"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

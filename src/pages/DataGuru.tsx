import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, User,
} from "lucide-react";
import GuruModal, { type Guru } from "../components/GuruModal";

const dataAwal: Guru[] = [
  { id: 1, nip: "G001", nama: "Siti Nurhaliza, S.Pd", jk: "Perempuan", jabatan: "Kepala Sekolah", alamat: "Jl. Kebon Jeruk Raya No. 12, Kebon Jeruk, Jakarta Barat", telepon: "0812-3456-7890" },
  { id: 2, nip: "G002", nama: "Andi Wijaya, S.Pd", jk: "Laki-laki", jabatan: "Guru Kelas", alamat: "Jl. Cempaka Putih Tengah No. 45, Cempaka Putih, Jakarta Pusat", telepon: "0813-2345-6789" },
  { id: 3, nip: "G003", nama: "Dewi Kurniawati, S.Pd", jk: "Perempuan", jabatan: "Guru Kelas", alamat: "Jl. Kemang Raya No. 8, Mampang Prapatan, Jakarta Selatan", telepon: "0812-8765-4321" },
  { id: 4, nip: "G004", nama: "Budi Santoso, S.Pd", jk: "Laki-laki", jabatan: "Guru Pendamping", alamat: "Jl. Pulo Gadung Raya No. 77, Pulo Gadung, Jakarta Timur", telepon: "0813-9876-5432" },
  { id: 5, nip: "G005", nama: "Rina Handayani, A.Md", jk: "Perempuan", jabatan: "Operator", alamat: "Jl. Daan Mogot Km. 18 No. 23, Kalideres, Jakarta Barat", telepon: "0812-1122-3344" },
  { id: 6, nip: "G006", nama: "Fajar Nugroho, S.Pd.I", jk: "Laki-laki", jabatan: "Guru Agama", alamat: "Jl. Raya Pasar Minggu No. 15, Pasar Minggu, Jakarta Selatan", telepon: "0813-4433-2211" },
  { id: 7, nip: "G007", nama: "Maya Lestari, S.Pd", jk: "Perempuan", jabatan: "Guru Kelas", alamat: "Jl. Sunter Permai Raya No. 5, Tanjung Priok, Jakarta Utara", telepon: "0812-5566-7788" },
  { id: 8, nip: "G008", nama: "Agung Prasetyo, S.Kom", jk: "Laki-laki", jabatan: "Tenaga Kebersihan", alamat: "Jl. Kramat Jaya No. 10, Senen, Jakarta Pusat", telepon: "0813-6655-8899" },
  { id: 9, nip: "G009", nama: "Lina Marlina, S.Pd", jk: "Perempuan", jabatan: "Guru Kelas", alamat: "Jl. Tebet Barat No. 21, Tebet, Jakarta Selatan", telepon: "0812-7788-9900" },
  { id: 10, nip: "G010", nama: "Hendra Gunawan, S.Pd", jk: "Laki-laki", jabatan: "Guru Pendamping", alamat: "Jl. Rawamangun Muka No. 9, Pulo Gadung, Jakarta Timur", telepon: "0813-1212-3434" },
  { id: 11, nip: "G011", nama: "Nurul Hidayah, S.Pd.I", jk: "Perempuan", jabatan: "Guru Agama", alamat: "Jl. Pondok Indah No. 3, Kebayoran Lama, Jakarta Selatan", telepon: "0812-4545-6767" },
  { id: 12, nip: "G012", nama: "Rudi Hartono, S.Pd", jk: "Laki-laki", jabatan: "Guru Kelas", alamat: "Jl. Kelapa Gading Boulevard No. 17, Jakarta Utara", telepon: "0813-8989-0101" },
  { id: 13, nip: "G013", nama: "Sari Wulandari, A.Md", jk: "Perempuan", jabatan: "Operator", alamat: "Jl. Palmerah Barat No. 6, Palmerah, Jakarta Barat", telepon: "0812-2323-4545" },
  { id: 14, nip: "G014", nama: "Teguh Prakoso, S.Pd", jk: "Laki-laki", jabatan: "Guru Pendamping", alamat: "Jl. Matraman Raya No. 30, Matraman, Jakarta Timur", telepon: "0813-5656-7878" },
  { id: 15, nip: "G015", nama: "Yuni Astuti, S.Pd", jk: "Perempuan", jabatan: "Guru Kelas", alamat: "Jl. Salemba Raya No. 14, Senen, Jakarta Pusat", telepon: "0812-9090-1212" },
];

const PER_HALAMAN = 8;

export default function DataGuru() {
  const [guru, setGuru] = useState<Guru[]>(dataAwal);
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState(1);

  const [modalBuka, setModalBuka] = useState(false);
  const [dipilih, setDipilih] = useState<Guru | null>(null);

  const hasil = guru.filter((g) =>
    (g.nama + g.nip + g.jabatan + g.alamat + g.telepon)
      .toLowerCase()
      .includes(cari.toLowerCase())
  );

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

  const bukaTambah = () => {
    setDipilih(null);
    setModalBuka(true);
  };

  const bukaEdit = (g: Guru) => {
    setDipilih(g);
    setModalBuka(true);
  };

  const simpan = (data: Omit<Guru, "id">) => {
    if (dipilih) {
      setGuru(guru.map((g) => (g.id === dipilih.id ? { ...g, ...data } : g)));
    } else {
      const idBaru = Math.max(0, ...guru.map((g) => g.id)) + 1;
      setGuru([...guru, { id: idBaru, ...data }]);
    }
    setModalBuka(false);
  };

  const hapus = (g: Guru) => {
    if (confirm(`Hapus data guru "${g.nama}"?`)) {
      setGuru(guru.filter((x) => x.id !== g.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Judul + breadcrumb */}
      <div>
        <h1 className="text-3xl font-bold text-hijau">Data Guru</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Data Guru</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        {/* Tombol tambah + pencarian */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <button
            onClick={bukaTambah}
            className="flex items-center justify-center gap-2 bg-hijau hover:bg-hijau-tua text-white font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Tambah Guru
          </button>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 sm:w-72 focus-within:ring-2 focus-within:ring-hijau">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHalaman(1); }}
              placeholder="Cari guru..."
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-left text-hijau-tua">
                <th className="px-3 py-3 font-semibold">No</th>
                <th className="px-3 py-3 font-semibold">NIP</th>
                <th className="px-3 py-3 font-semibold">Nama Guru</th>
                <th className="px-3 py-3 font-semibold">Jenis Kelamin</th>
                <th className="px-3 py-3 font-semibold">Jabatan</th>
                <th className="px-3 py-3 font-semibold">Alamat</th>
                <th className="px-3 py-3 font-semibold">No. Telepon</th>
                <th className="px-3 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Data guru tidak ditemukan.
                  </td>
                </tr>
              )}

              {tampil.map((g, i) => (
                <tr key={g.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-4">{mulai + i + 1}</td>
                  <td className="px-3 py-4">{g.nip}</td>
                  <td className="px-3 py-4 min-w-[170px]">{g.nama}</td>
                  <td className="px-3 py-4">
                    {g.jk === "Laki-laki" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-xs whitespace-nowrap">
                        <User className="w-3.5 h-3.5" /> Laki-laki
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-pink-50 text-pink-600 text-xs whitespace-nowrap">
                        <User className="w-3.5 h-3.5" /> Perempuan
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">{g.jabatan}</td>
                  <td className="px-3 py-4 min-w-[220px]">{g.alamat}</td>
                  <td className="px-3 py-4 whitespace-nowrap">{g.telepon}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => bukaEdit(g)}
                        title="Edit"
                        className="w-8 h-8 rounded-md bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => hapus(g)}
                        title="Hapus"
                        className="w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info + pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <p className="text-sm text-gray-600">
            Menampilkan {hasil.length === 0 ? 0 : mulai + 1} sampai{" "}
            {Math.min(mulai + PER_HALAMAN, hasil.length)} dari {hasil.length} data
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHalaman(halamanAktif - 1)}
              disabled={halamanAktif === 1}
              className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalHalaman }, (_, n) => n + 1).map((n) => (
              <button
                key={n}
                onClick={() => setHalaman(n)}
                className={`w-9 h-9 rounded-md border text-sm font-medium ${
                  n === halamanAktif
                    ? "bg-hijau border-hijau text-white"
                    : "border-gray-300 text-gray-700 hover:bg-green-50"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setHalaman(halamanAktif + 1)}
              disabled={halamanAktif === totalHalaman}
              className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <GuruModal
        open={modalBuka}
        data={dipilih}
        onClose={() => setModalBuka(false)}
        onSave={simpan}
      />
    </div>
  );
}
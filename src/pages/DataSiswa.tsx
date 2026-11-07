import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight,
  ChevronRight as Panah, Mars, Venus,
} from "lucide-react";
import SiswaModal, { type Siswa } from "../components/SiswaModal";

const dataAwal: Siswa[] = [
  { id: 1, nis: "001", nama: "Alvino Putra Wijaya", jk: "Laki-laki", tempatLahir: "Jakarta Selatan", tanggalLahir: "2015-03-12", alamat: "Jl. Kemang Raya No. 10, Jakarta Selatan" },
  { id: 2, nis: "002", nama: "Aurelia Nabila Putri", jk: "Perempuan", tempatLahir: "Jakarta Barat", tanggalLahir: "2015-05-25", alamat: "Jl. Taman Palem Lestari No. 45, Jakarta Barat" },
  { id: 3, nis: "003", nama: "Rafael Aditya Pratama", jk: "Laki-laki", tempatLahir: "Jakarta Timur", tanggalLahir: "2015-07-17", alamat: "Jl. Pondok Kelapa Raya No. 8, Jakarta Timur" },
  { id: 4, nis: "004", nama: "Zahra Aisyah Ramadhani", jk: "Perempuan", tempatLahir: "Jakarta Utara", tanggalLahir: "2015-11-30", alamat: "Jl. Sunter Permai Raya No. 22, Jakarta Utara" },
  { id: 5, nis: "005", nama: "M. Arkan Darmawan", jk: "Laki-laki", tempatLahir: "Jakarta Pusat", tanggalLahir: "2016-01-21", alamat: "Jl. Cempaka Putih Tengah No. 12, Jakarta Pusat" },
  { id: 6, nis: "006", nama: "Kayla Putri Anindita", jk: "Perempuan", tempatLahir: "Jakarta Selatan", tanggalLahir: "2016-04-10", alamat: "Jl. Cipete Raya No. 7, Jakarta Selatan" },
  { id: 7, nis: "007", nama: "Darren Alif Nugroho", jk: "Laki-laki", tempatLahir: "Jakarta Barat", tanggalLahir: "2016-06-05", alamat: "Jl. Green Garden No. 15, Jakarta Barat" },
  { id: 8, nis: "008", nama: "Nayla Khairunnisa", jk: "Perempuan", tempatLahir: "Jakarta Timur", tanggalLahir: "2016-08-18", alamat: "Jl. Duren Sawit Baru No. 9, Jakarta Timur" },
  { id: 9, nis: "009", nama: "Bima Satria Mahendra", jk: "Laki-laki", tempatLahir: "Jakarta Selatan", tanggalLahir: "2016-09-02", alamat: "Jl. Tebet Barat No. 3, Jakarta Selatan" },
  { id: 10, nis: "010", nama: "Citra Maharani", jk: "Perempuan", tempatLahir: "Jakarta Barat", tanggalLahir: "2016-10-14", alamat: "Jl. Kebon Jeruk No. 18, Jakarta Barat" },
];

const PER_HALAMAN = 8;

// yyyy-mm-dd  ->  dd-mm-yyyy
const formatTanggal = (t: string) => t.split("-").reverse().join("-");

export default function DataSiswa() {
  const [siswa, setSiswa] = useState<Siswa[]>(dataAwal);
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState(1);

  const [modalBuka, setModalBuka] = useState(false);
  const [dipilih, setDipilih] = useState<Siswa | null>(null);

  // Filter berdasarkan pencarian
  const hasil = siswa.filter((s) =>
    (s.nama + s.nis + s.alamat + s.tempatLahir)
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

  const bukaEdit = (s: Siswa) => {
    setDipilih(s);
    setModalBuka(true);
  };

  const simpan = (data: Omit<Siswa, "id">) => {
    if (dipilih) {
      setSiswa(siswa.map((s) => (s.id === dipilih.id ? { ...s, ...data } : s)));
    } else {
      const idBaru = Math.max(0, ...siswa.map((s) => s.id)) + 1;
      setSiswa([...siswa, { id: idBaru, ...data }]);
    }
    setModalBuka(false);
  };

  const hapus = (s: Siswa) => {
    if (confirm(`Hapus data siswa "${s.nama}"?`)) {
      setSiswa(siswa.filter((x) => x.id !== s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Judul + breadcrumb */}
      <div>
        <h1 className="text-3xl font-bold text-hijau">Data Siswa</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <Panah className="w-4 h-4" />
          <span>Data Siswa</span>
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
            Tambah Siswa
          </button>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 sm:w-72 focus-within:ring-2 focus-within:ring-hijau">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHalaman(1); }}
              placeholder="Cari siswa..."
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
                <th className="px-3 py-3 font-semibold">NIS</th>
                <th className="px-3 py-3 font-semibold">Nama Siswa</th>
                <th className="px-3 py-3 font-semibold">Jenis Kelamin</th>
                <th className="px-3 py-3 font-semibold">Tempat Lahir</th>
                <th className="px-3 py-3 font-semibold">Tanggal Lahir</th>
                <th className="px-3 py-3 font-semibold">Alamat</th>
                <th className="px-3 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Data siswa tidak ditemukan.
                  </td>
                </tr>
              )}

              {tampil.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-4">{mulai + i + 1}</td>
                  <td className="px-3 py-4">{s.nis}</td>
                  <td className="px-3 py-4 min-w-[160px]">{s.nama}</td>
                  <td className="px-3 py-4">
                    {s.jk === "Laki-laki" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-xs whitespace-nowrap">
                        <Mars className="w-3.5 h-3.5" /> Laki-laki
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-pink-50 text-pink-600 text-xs whitespace-nowrap">
                        <Venus className="w-3.5 h-3.5" /> Perempuan
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">{s.tempatLahir}</td>
                  <td className="px-3 py-4 whitespace-nowrap">{formatTanggal(s.tanggalLahir)}</td>
                  <td className="px-3 py-4 min-w-[200px]">{s.alamat}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => bukaEdit(s)}
                        title="Edit"
                        className="w-8 h-8 rounded-md bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => hapus(s)}
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

      <SiswaModal
        open={modalBuka}
        data={dipilih}
        onClose={() => setModalBuka(false)}
        onSave={simpan}
      />
    </div>
  );
}
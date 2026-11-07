import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Trash2, Eye, ChevronLeft, ChevronRight, FileText,
  Calendar, BookOpen, Folder, GraduationCap, FileCheck, Users, Camera, CircleDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ArsipModal, { type Arsip } from "../components/ArsipModal";

const gayaKategori: Record<string, { warna: string; ikon: LucideIcon }> = {
  Perencanaan: { warna: "bg-green-50 text-green-700", ikon: Calendar },
  Pembelajaran: { warna: "bg-blue-50 text-blue-700", ikon: BookOpen },
  Administrasi: { warna: "bg-purple-50 text-purple-700", ikon: Folder },
  Akademik: { warna: "bg-yellow-50 text-yellow-700", ikon: GraduationCap },
  Legalitas: { warna: "bg-orange-50 text-orange-600", ikon: FileCheck },
  Kelembagaan: { warna: "bg-teal-50 text-teal-700", ikon: Users },
  Dokumentasi: { warna: "bg-pink-50 text-pink-600", ikon: Camera },
  Keuangan: { warna: "bg-gray-100 text-gray-700", ikon: CircleDollarSign },
};

const buat = (
  id: number, kode: string, nama: string, kategori: string,
  tanggal: string, lemari: string, rak: string, map: string
): Arsip => ({
  id, kode, nama, kategori, tanggal, lemari, rak, map,
  namaFile: `arsip-${id}.pdf`,
  urlFile: "",
});

export const dataAwal: Arsip[] = [
  buat(1, "ARS/2025/001", "RKT (Rencana Kegiatan Tahunan) 2024/2025", "Perencanaan", "2024-07-15", "Lemari Arsip 1", "Rak A", "Map 01"),
  buat(2, "ARS/2025/002", "RKH (Rencana Kegiatan Harian) Bulan Mei 2025", "Pembelajaran", "2025-05-31", "Lemari Arsip 1", "Rak A", "Map 02"),
  buat(3, "ARS/2025/003", "Daftar Hadir Siswa Bulan April 2025", "Administrasi", "2025-04-30", "Lemari Arsip 2", "Rak B", "Map 01"),
  buat(4, "ARS/2025/004", "Laporan Perkembangan Siswa Semester 1 TA 2024/2025", "Akademik", "2025-01-20", "Lemari Arsip 2", "Rak B", "Map 02"),
  buat(5, "ARS/2025/005", "Surat Izin Operasional TK Tunas Kintamani 2", "Legalitas", "2024-01-10", "Lemari Arsip 3", "Rak C", "Map 01"),
  buat(6, "ARS/2025/006", "Struktur Organisasi Tahun 2025", "Kelembagaan", "2025-01-05", "Lemari Arsip 3", "Rak C", "Map 02"),
  buat(7, "ARS/2025/007", "Dokumentasi Kegiatan Outing Class 2024", "Dokumentasi", "2024-11-28", "Lemari Arsip 4", "Rak D", "Map 01"),
  buat(8, "ARS/2025/008", "Laporan Keuangan Bulan April 2025", "Keuangan", "2025-05-05", "Lemari Arsip 4", "Rak D", "Map 02"),
  buat(9, "ARS/2025/009", "Data Inventaris Sekolah 2025", "Administrasi", "2025-02-14", "Lemari Arsip 2", "Rak B", "Map 03"),
  buat(10, "ARS/2025/010", "Kalender Pendidikan 2024/2025", "Perencanaan", "2024-07-10", "Lemari Arsip 1", "Rak A", "Map 03"),
];

const PER_HALAMAN = 8;

const formatTanggal = (t: string) => t.split("-").reverse().join("-");

export default function DokumenArsip() {
  const [arsip, setArsip] = useState<Arsip[]>(dataAwal);
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [modalBuka, setModalBuka] = useState(false);

  // Kode otomatis: ARS/tahun/nomor urut berikutnya
  const nomorBerikut = Math.max(0, ...arsip.map((a) => a.id)) + 1;
  const kodeBaru = `ARS/${new Date().getFullYear()}/${String(nomorBerikut).padStart(3, "0")}`;

  const hasil = arsip.filter((a) =>
    (a.kode + a.nama + a.kategori + a.lemari + a.rak + a.map)
      .toLowerCase()
      .includes(cari.toLowerCase())
  );

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

  const simpan = (data: Omit<Arsip, "id">) => {
    setArsip([{ id: nomorBerikut, ...data }, ...arsip]);
    setModalBuka(false);
  };

  const hapus = (a: Arsip) => {
    if (confirm(`Hapus dokumen "${a.nama}"?`)) {
      setArsip(arsip.filter((x) => x.id !== a.id));
    }
  };

  const bukaFile = (a: Arsip) => {
    if (a.urlFile) {
      window.open(a.urlFile, "_blank");
    } else {
      alert("Ini data contoh, belum ada file yang diupload.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Dokumen Arsip</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Dokumen Arsip</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <button
            onClick={() => setModalBuka(true)}
            className="flex items-center justify-center gap-2 bg-hijau hover:bg-hijau-tua text-white font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Tambah Dokumen
          </button>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 sm:w-72 focus-within:ring-2 focus-within:ring-hijau">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHalaman(1); }}
              placeholder="Cari dokumen arsip..."
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-left text-hijau-tua">
                <th className="px-3 py-3 font-semibold">No</th>
                <th className="px-3 py-3 font-semibold">Kode Arsip</th>
                <th className="px-3 py-3 font-semibold">Nama Dokumen</th>
                <th className="px-3 py-3 font-semibold">Kategori</th>
                <th className="px-3 py-3 font-semibold">Tanggal Arsip</th>
                <th className="px-3 py-3 font-semibold">Lokasi Penyimpanan</th>
                <th className="px-3 py-3 font-semibold">File</th>
                <th className="px-3 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Dokumen arsip tidak ditemukan.
                  </td>
                </tr>
              )}

              {tampil.map((a, i) => {
                const gaya = gayaKategori[a.kategori] ?? gayaKategori.Administrasi;
                const Ikon = gaya.ikon;
                return (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-4">{mulai + i + 1}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{a.kode}</td>
                    <td className="px-3 py-4 min-w-[200px]">{a.nama}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${gaya.warna}`}>
                        <Ikon className="w-3.5 h-3.5" /> {a.kategori}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">{formatTanggal(a.tanggal)}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {a.lemari}<br />{a.rak} - {a.map}
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => bukaFile(a)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
                      >
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => bukaFile(a)}
                          title="Lihat"
                          className="w-8 h-8 rounded-md bg-hijau hover:bg-hijau-tua text-white flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => hapus(a)}
                          title="Hapus"
                          className="w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

      <ArsipModal
        open={modalBuka}
        data={null}
        kodeBaru={kodeBaru}
        onClose={() => setModalBuka(false)}
        onSave={simpan}
      />
    </div>
  );
}
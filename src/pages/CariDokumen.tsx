import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search, RotateCcw, Eye, ChevronLeft, ChevronRight, FileText,
  Calendar, BookOpen, Folder, GraduationCap, FileCheck, Users, Camera, CircleDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { daftarKategori } from "../components/ArsipModal";
import { dataAwal } from "./DokumenArsip";
import { ambilArsip } from "../arsipStore";

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

const daftarJenis = ["PDF", "DOC", "DOCX", "XLS", "XLSX", "JPG", "PNG"];
const daftarLemari = ["Lemari Arsip 1", "Lemari Arsip 2", "Lemari Arsip 3", "Lemari Arsip 4"];

const warnaJenis: Record<string, string> = {
  PDF: "bg-red-50 text-red-600 border-red-200",
  DOC: "bg-blue-50 text-blue-600 border-blue-200",
  DOCX: "bg-blue-50 text-blue-600 border-blue-200",
  XLS: "bg-green-50 text-green-700 border-green-200",
  XLSX: "bg-green-50 text-green-700 border-green-200",
  JPG: "bg-purple-50 text-purple-600 border-purple-200",
  PNG: "bg-purple-50 text-purple-600 border-purple-200",
};

const PER_HALAMAN = 8;

const formatTanggal = (t: string) => t.split("-").reverse().join("-");

const jenisFile = (nama: string) => {
  const e = (nama.split(".").pop() ?? "pdf").toUpperCase();
  return e === "JPEG" ? "JPG" : e;
};

type Filter = {
  kunci: string;
  kategori: string;
  jenis: string;
  dari: string;
  sampai: string;
  lokasi: string;
  urut: string;
};

const filterKosong: Filter = {
  kunci: "", kategori: "", jenis: "", dari: "", sampai: "", lokasi: "", urut: "terbaru",
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700 bg-white text-sm";

export default function CariDokumen() {
  const [semua] = useState(() => ambilArsip() ?? dataAwal);

  const [form, setForm] = useState<Filter>(filterKosong);
  const [aktif, setAktif] = useState<Filter>(filterKosong);
  const [halaman, setHalaman] = useState(1);

  // Setiap perubahan kolom langsung diterapkan ke tabel
  const ubah = (field: keyof Filter, nilai: string) => {
    const baru = { ...form, [field]: nilai };
    setForm(baru);
    setAktif(baru);
    setHalaman(1);
  };

  const cari = (e: FormEvent) => {
    e.preventDefault();
    setAktif(form);
    setHalaman(1);
  };

  const reset = () => {
    setForm(filterKosong);
    setAktif(filterKosong);
    setHalaman(1);
  };

  // Terapkan filter
  const hasil = semua
    .filter((a) => {
      const teks = (a.kode + a.nama + a.kategori + (a.deskripsi ?? "")).toLowerCase();
      if (aktif.kunci && !teks.includes(aktif.kunci.toLowerCase())) return false;
      if (aktif.kategori && a.kategori !== aktif.kategori) return false;
      if (aktif.jenis && jenisFile(a.namaFile) !== aktif.jenis) return false;
      if (aktif.lokasi && a.lemari !== aktif.lokasi) return false;
      if (aktif.dari && a.tanggal < aktif.dari) return false;
      if (aktif.sampai && a.tanggal > aktif.sampai) return false;
      return true;
    })
    .sort((x, y) => {
      if (aktif.urut === "terlama") return x.tanggal.localeCompare(y.tanggal);
      if (aktif.urut === "az") return x.nama.localeCompare(y.nama);
      if (aktif.urut === "za") return y.nama.localeCompare(x.nama);
      return y.tanggal.localeCompare(x.tanggal); // terbaru
    });

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

  const bukaFile = (urlFile: string) => {
    if (urlFile) window.open(urlFile, "_blank");
    else alert("Ini data contoh / file belum tersedia di browser ini.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Cari Dokumen</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Cari Dokumen</span>
        </div>
      </div>

      {/* ===== Filter ===== */}
      <form onSubmit={cari} className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Kata Kunci</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                value={form.kunci}
                onChange={(e) => ubah("kunci", e.target.value)}
                placeholder="Masukkan kata kunci..."
              />
              <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Kategori</label>
            <select className={inputClass} value={form.kategori}
              onChange={(e) => ubah("kategori", e.target.value)}>
              <option value="">Semua Kategori</option>
              {daftarKategori.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Jenis Dokumen</label>
            <select className={inputClass} value={form.jenis}
              onChange={(e) => ubah("jenis", e.target.value)}>
              <option value="">Semua Jenis</option>
              {daftarJenis.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Tanggal Arsip</label>
            <div className="flex items-center gap-1">
              <input type="date" title="Dari tanggal" className={inputClass} value={form.dari}
                onChange={(e) => ubah("dari", e.target.value)} />
              <span className="text-gray-400">-</span>
              <input type="date" title="Sampai tanggal" className={inputClass} value={form.sampai}
                onChange={(e) => ubah("sampai", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Lokasi Penyimpanan</label>
            <select className={inputClass} value={form.lokasi}
              onChange={(e) => ubah("lokasi", e.target.value)}>
              <option value="">Semua Lokasi</option>
              {daftarLemari.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="sm:w-64">
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Urutkan Berdasarkan</label>
            <select className={inputClass} value={form.urut}
              onChange={(e) => ubah("urut", e.target.value)}>
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="az">Nama A - Z</option>
              <option value="za">Nama Z - A</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-semibold"
            >
              <Search className="w-4 h-4" />
              Cari Dokumen
            </button>
          </div>
        </div>
      </form>

      {/* ===== Hasil ===== */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-hijau">Hasil Pencarian</h3>
          <p className="text-sm text-gray-600">
            Ditemukan <span className="font-semibold text-hijau">{hasil.length}</span> dokumen
          </p>
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
                    Tidak ada dokumen yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}

              {tampil.map((a, i) => {
                const gaya = gayaKategori[a.kategori] ?? gayaKategori.Administrasi;
                const Ikon = gaya.ikon;
                const jenis = jenisFile(a.namaFile);
                return (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-4">{mulai + i + 1}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{a.kode}</td>
                    <td className="px-3 py-4 min-w-[220px]">{a.nama}</td>
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium ${warnaJenis[jenis] ?? warnaJenis.PDF}`}>
                        <FileText className="w-3.5 h-3.5" /> {jenis}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => bukaFile(a.urlFile)}
                          title="Lihat"
                          className="w-8 h-8 rounded-md bg-hijau hover:bg-hijau-tua text-white flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4" />
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
    </div>
  );
}
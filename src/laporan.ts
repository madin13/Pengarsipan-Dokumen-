import type { Arsip } from "./components/ArsipModal";
import { daftarKategori } from "./components/ArsipModal";

export type FilterLaporan = {
  dari: string;
  sampai: string;
  kategori: string;
  jenis: string;
};

export const filterAwal: FilterLaporan = { dari: "", sampai: "", kategori: "", jenis: "" };

// Data surat masih contoh (data surat belum dibagi antar halaman)
export const SURAT_MASUK = 45;
export const SURAT_KELUAR = 38;

export const warnaKategori: Record<string, string> = {
  Perencanaan: "#4caf50",
  Pembelajaran: "#3b82f6",
  Administrasi: "#8b5cf6",
  Akademik: "#fbbf24",
  Legalitas: "#ef4444",
  Kelembagaan: "#14b8a6",
  Dokumentasi: "#f472b6",
  Keuangan: "#cbd5e1",
};

export const jenisFile = (nama: string) => {
  const e = (nama.split(".").pop() ?? "pdf").toUpperCase();
  return e === "JPEG" ? "JPG" : e;
};

// Ukuran file belum disimpan, jadi dipakai angka contoh (MB)
export const ukuranMB = (a: Arsip) => ((a.id * 53) % 400) + 20;

export const formatPanjang = (t: string) =>
  new Date(t + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });

export const periodeTeks = (f: FilterLaporan) =>
  f.dari && f.sampai
    ? `${formatPanjang(f.dari)} - ${formatPanjang(f.sampai)}`
    : f.dari
    ? `Sejak ${formatPanjang(f.dari)}`
    : f.sampai
    ? `Sampai ${formatPanjang(f.sampai)}`
    : "Semua periode";

export const waktuSekarang = () =>
  new Date().toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).replace(".", ":") + " WIB";

export function saring(data: Arsip[], f: FilterLaporan) {
  return data.filter((a) => {
    if (f.dari && a.tanggal < f.dari) return false;
    if (f.sampai && a.tanggal > f.sampai) return false;
    if (f.kategori && a.kategori !== f.kategori) return false;
    if (f.jenis && jenisFile(a.namaFile) !== f.jenis) return false;
    return true;
  });
}

export function ringkasan(data: Arsip[]) {
  const total = data.length;
  const baris = daftarKategori.map((k) => {
    const d = data.filter((a) => a.kategori === k);
    return {
      kategori: k,
      jumlah: d.length,
      persen: total ? (d.length / total) * 100 : 0,
      ukuran: d.reduce((s, a) => s + ukuranMB(a), 0),
    };
  });
  const totalUkuran = baris.reduce((s, b) => s + b.ukuran, 0);
  return { total, baris, totalUkuran };
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function perBulan(data: Arsip[], tahun: string) {
  return BULAN.map((b, i) => ({
    bulan: `${b} ${tahun}`,
    jumlah: data.filter((a) => a.tanggal.startsWith(`${tahun}-${String(i + 1).padStart(2, "0")}`)).length,
  }));
}

export const ukuranTeks = (mb: number) =>
  mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
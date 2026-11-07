import { useEffect, useState } from "react";

export type Peran = "operator" | "kepsek";

export type Pengguna = {
  peran: Peran;
  nama: string;
  jabatan: string;
  warna: string;  // warna lingkaran avatar
  menu: string[]; // halaman yang boleh dibuka
};

const SEMUA = [
  "/dashboard", "/data-siswa", "/data-guru", "/surat-masuk", "/surat-keluar",
  "/dokumen-arsip", "/upload-dokumen", "/cari-dokumen", "/laporan-arsip",
];

export const daftarPengguna: Pengguna[] = [
  {
    peran: "operator",
    nama: "Paramadina Mulya",
    jabatan: "Operator Sekolah",
    warna: "bg-green-100 text-green-700",
    menu: SEMUA,
  },
  {
    peran: "kepsek",
    nama: "Heni Yuliati, A.Ma",
    jabatan: "Kepala Sekolah",
    warna: "bg-orange-100 text-orange-600",
    menu: SEMUA.filter((m) => m !== "/upload-dokumen"),
  },
];

const KUNCI = "pengguna-aktif";
const EVENT = "pengguna-berubah";

export function penggunaAktif(): Pengguna {
  try {
    const peran = localStorage.getItem(KUNCI);
    const ketemu = daftarPengguna.find((p) => p.peran === peran);
    if (ketemu) return ketemu;
  } catch {
    // abaikan
  }
  return daftarPengguna[0]; // default: Operator Sekolah
}

export function gantiPengguna(peran: Peran) {
  try {
    localStorage.setItem(KUNCI, peran);
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
}

// Apakah pengguna boleh membuka halaman ini?
export function bolehAkses(p: Pengguna, path: string) {
  return p.menu.some((m) => path === m || path.startsWith(m + "/"));
}

// Hook: komponen otomatis ter-update saat akun diganti
export function usePengguna() {
  const [p, setP] = useState<Pengguna>(penggunaAktif);

  useEffect(() => {
    const segarkan = () => setP(penggunaAktif());
    window.addEventListener(EVENT, segarkan);
    window.addEventListener("storage", segarkan);
    return () => {
      window.removeEventListener(EVENT, segarkan);
      window.removeEventListener("storage", segarkan);
    };
  }, []);

  return p;
}
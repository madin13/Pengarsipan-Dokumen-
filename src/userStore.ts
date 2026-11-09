import { useEffect, useState } from "react";

export type Peran = "operator" | "kepsek" | "guru";

export type Akun = {
  id: number;
  nama: string;
  username: string;
  peran: Peran;
  aktif: boolean;
};

// Akun + data turunan dari perannya
export type Pengguna = Akun & {
  jabatan: string;
  warna: string;
  menu: string[];
};

const DASAR = [
  "/dashboard", "/data-siswa", "/data-guru", "/surat-masuk", "/surat-keluar",
  "/dokumen-arsip", "/upload-dokumen", "/cari-dokumen", "/laporan-arsip",
];

export const infoPeran: Record<
  Peran,
  {
    label: string;
    warna: string;
    badge: string;
    tombol: string;
    menu: string[];
    deskripsi: string;
  }
> = {
  operator: {
    label: "Operator Sekolah",
    warna: "bg-green-100 text-green-700",
    badge: "bg-green-50 text-green-700",
    tombol: "bg-hijau hover:bg-hijau-tua",
    menu: [...DASAR, "/manajemen-user"],
    deskripsi: "Akses penuh, termasuk Manajemen User",
  },
  kepsek: {
    label: "Kepala Sekolah",
    warna: "bg-orange-100 text-orange-600",
    badge: "bg-orange-50 text-orange-600",
    tombol: "bg-orange-500 hover:bg-orange-600",
    menu: DASAR.filter((m) => m !== "/upload-dokumen"),
    deskripsi: "Semua menu kecuali Upload Dokumen dan Manajemen User",
  },
  guru: {
    label: "Guru",
    warna: "bg-blue-100 text-blue-700",
    badge: "bg-blue-50 text-blue-700",
    tombol: "bg-blue-600 hover:bg-blue-700",
    menu: ["/dashboard", "/dokumen-arsip", "/cari-dokumen"],
    deskripsi: "Beranda, Dokumen Arsip, dan Cari Dokumen",
  },
};

const AWAL: Akun[] = [
  { id: 1, nama: "Paramadina Mulya", username: "paramadina", peran: "operator", aktif: true },
  { id: 2, nama: "Heni Yuliati, A.Ma", username: "heni", peran: "kepsek", aktif: true },
  { id: 3, nama: "Siti Nurhaliza, S.Pd", username: "siti", peran: "guru", aktif: true },
];

const KUNCI_AKUN = "daftar-akun";
const KUNCI_AKTIF = "akun-aktif";
const EVENT = "akun-berubah";

export function bacaAkun(): Akun[] {
  try {
    const teks = localStorage.getItem(KUNCI_AKUN);
    if (teks) return JSON.parse(teks) as Akun[];
  } catch {
    // lanjut ke data awal
  }
  return AWAL;
}

export function simpanAkun(daftar: Akun[]) {
  try {
    localStorage.setItem(KUNCI_AKUN, JSON.stringify(daftar));
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
}

const lengkapi = (a: Akun): Pengguna => ({
  ...a,
  jabatan: infoPeran[a.peran].label,
  warna: infoPeran[a.peran].warna,
  menu: infoPeran[a.peran].menu,
});

export function penggunaAktif(): Pengguna {
  const semua = bacaAkun();
  const aktif = semua.filter((a) => a.aktif);
  let id = 0;
  try {
    id = Number(localStorage.getItem(KUNCI_AKTIF));
  } catch {
    // abaikan
  }
  // Jika akun terpilih sudah dihapus/nonaktif, pakai akun aktif pertama
  const a = aktif.find((x) => x.id === id) ?? aktif[0] ?? semua[0];
  return lengkapi(a);
}

export function gantiPengguna(id: number) {
  try {
    localStorage.setItem(KUNCI_AKTIF, String(id));
  } catch {
    // abaikan
  }
  window.dispatchEvent(new Event(EVENT));
}

// Apakah pengguna boleh membuka halaman ini?
export function bolehAkses(p: Pengguna, path: string) {
  return p.menu.some((m) => path === m || path.startsWith(m + "/"));
}

// Hook: akun yang sedang dipakai
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

// Hook: seluruh daftar akun
export function useDaftarAkun() {
  const [daftar, setDaftar] = useState<Akun[]>(bacaAkun);

  useEffect(() => {
    const segarkan = () => setDaftar(bacaAkun());
    window.addEventListener(EVENT, segarkan);
    window.addEventListener("storage", segarkan);
    return () => {
      window.removeEventListener(EVENT, segarkan);
      window.removeEventListener("storage", segarkan);
    };
  }, []);

  return daftar;
}
export type Notifikasi = {
  id: number;
  judul: string;
  isi: string;
  waktu: string; // ISO
  dibaca: boolean;
  ke: string;    // halaman tujuan saat diklik
};

const KUNCI = "notifikasi";
const EVENT = "notifikasi-berubah";

// Notifikasi contoh untuk pertama kali (3 belum dibaca, seperti di desain)
const awal = (): Notifikasi[] => {
  const kini = Date.now();
  return [
    { id: 3, judul: "Surat Masuk baru diterima", isi: "Dari Dinas Pendidikan - Undangan Rapat", waktu: new Date(kini - 15 * 60000).toISOString(), dibaca: false, ke: "/surat-masuk" },
    { id: 2, judul: "Dokumen diarsipkan", isi: "Laporan Perkembangan Siswa Semester 2", waktu: new Date(kini - 90 * 60000).toISOString(), dibaca: false, ke: "/dokumen-arsip" },
    { id: 1, judul: "Surat Keluar baru dibuat", isi: "Surat Undangan Rapat Orang Tua", waktu: new Date(kini - 5 * 3600000).toISOString(), dibaca: false, ke: "/surat-keluar" },
  ];
};

const tulis = (daftar: Notifikasi[]) => {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(daftar));
  } catch {
    // abaikan
  }
};

const simpan = (daftar: Notifikasi[]) => {
  tulis(daftar);
  window.dispatchEvent(new Event(EVENT)); // beri tahu Topbar
};

export function ambilNotifikasi(): Notifikasi[] {
  try {
    const teks = localStorage.getItem(KUNCI);
    if (teks) return JSON.parse(teks) as Notifikasi[];
  } catch {
    // lanjut ke data awal
  }
  const a = awal();
  tulis(a);
  return a;
}

export function tambahNotifikasi(n: Pick<Notifikasi, "judul" | "isi" | "ke">) {
  const daftar = ambilNotifikasi();
  const id = Math.max(0, ...daftar.map((x) => x.id)) + 1;
  simpan([{ id, ...n, waktu: new Date().toISOString(), dibaca: false }, ...daftar].slice(0, 30));
}

export function tandaiDibaca(id: number) {
  simpan(ambilNotifikasi().map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
}

export function tandaiSemuaDibaca() {
  simpan(ambilNotifikasi().map((n) => ({ ...n, dibaca: true })));
}

export function hapusSemua() {
  simpan([]);
}

export const EVENT_NOTIFIKASI = EVENT;

// Contoh: "5 menit lalu"
export function waktuRelatif(iso: string): string {
  const selisih = Math.max(0, Date.now() - new Date(iso).getTime());
  const menit = Math.floor(selisih / 60000);
  if (menit < 1) return "Baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}
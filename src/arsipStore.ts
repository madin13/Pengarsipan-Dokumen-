import type { Arsip } from "./components/ArsipModal";

const KUNCI = "arsip-dokumen";

export function ambilArsip(): Arsip[] | null {
  try {
    const teks = localStorage.getItem(KUNCI);
    return teks ? (JSON.parse(teks) as Arsip[]) : null;
  } catch {
    return null;
  }
}

export function simpanArsip(daftar: Arsip[]) {
  try {
    const aman = daftar.map((a) => ({ ...a, urlFile: "" }));
    localStorage.setItem(KUNCI, JSON.stringify(aman));
  } catch {
    // abaikan
  }
}

export function buatKode(daftar: Arsip[]): string {
  const nomor = Math.max(0, ...daftar.map((a) => a.id)) + 1;
  return `ARS/${new Date().getFullYear()}/${String(nomor).padStart(3, "0")}`;
}
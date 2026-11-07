import { Link } from "react-router-dom";
import { Mail, Send, Folder, CloudUpload, Search } from "lucide-react";

const aktivitas = [
  { icon: Mail, style: "bg-green-100 text-green-600", judul: "Surat Masuk baru diterima", desc: "Dari Dinas Pendidikan - Undangan Rapat", waktu: "10:15 WIB" },
  { icon: Send, style: "bg-orange-100 text-orange-500", judul: "Surat Keluar baru dibuat", desc: "Surat Undangan Rapat Orang Tua", waktu: "09:45 WIB" },
  { icon: Folder, style: "bg-purple-100 text-purple-600", judul: "Dokumen diarsipkan", desc: "Laporan Perkembangan Siswa Semester 2", waktu: "09:30 WIB" },
  { icon: CloudUpload, style: "bg-teal-100 text-teal-600", judul: "Dokumen berhasil diupload", desc: "Struktur Organisasi Tahun 2025", waktu: "09:10 WIB" },
  { icon: Search, style: "bg-blue-100 text-blue-600", judul: "Pencarian dokumen dilakukan", desc: "Kata kunci: laporan keuangan", waktu: "08:50 WIB" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="font-bold text-hijau mb-4">Aktivitas Terbaru</h3>

      <ul className="space-y-4">
        {aktivitas.map((a, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${a.style}`}>
              <a.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{a.judul}</p>
              <p className="text-sm text-gray-500 truncate">{a.desc}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{a.waktu}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-5">
        <Link
          to="/laporan-arsip"
          className="border border-hijau text-hijau hover:bg-green-50 px-5 py-2 rounded-md text-sm font-medium transition"
        >
          Lihat Semua Aktivitas
        </Link>
      </div>
    </div>
  );
}
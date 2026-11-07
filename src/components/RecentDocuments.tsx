import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const docs = [
  { nama: "RKT (Rencana Kegiatan Tahunan) 2024/2025", kategori: "Perencanaan", tanggal: "31-05-2025", lokasi: "Lemari Arsip 1, Rak A - Map 01", tipe: "PDF" },
  { nama: "Surat Undangan Rapat Orang Tua", kategori: "Surat Keluar", tanggal: "31-05-2025", lokasi: "Lemari Arsip 1, Rak A - Map 02", tipe: "PDF" },
  { nama: "Laporan Perkembangan Siswa Semester 2", kategori: "Administrasi", tanggal: "30-05-2025", lokasi: "Lemari Arsip 2, Rak B - Map 01", tipe: "PDF" },
  { nama: "Struktur Organisasi Tahun 2025", kategori: "Kelembagaan", tanggal: "30-05-2025", lokasi: "Lemari Arsip 3, Rak C - Map 01", tipe: "JPG" },
  { nama: "Laporan Keuangan Bulan April 2025", kategori: "Keuangan", tanggal: "29-05-2025", lokasi: "Lemari Arsip 4, Rak D - Map 02", tipe: "PDF" },
];

const warnaKategori: Record<string, string> = {
  Perencanaan: "bg-green-50 text-green-700",
  "Surat Keluar": "bg-orange-50 text-orange-600",
  Administrasi: "bg-purple-50 text-purple-600",
  Kelembagaan: "bg-teal-50 text-teal-600",
  Keuangan: "bg-gray-100 text-gray-600",
};

const warnaTipe: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  JPG: "bg-purple-50 text-purple-600",
};

export default function RecentDocuments() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="font-bold text-hijau mb-4">Dokumen Terbaru</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700">
              <th className="px-3 py-2 font-semibold">No</th>
              <th className="px-3 py-2 font-semibold">Nama Dokumen</th>
              <th className="px-3 py-2 font-semibold">Kategori</th>
              <th className="px-3 py-2 font-semibold">Tanggal</th>
              <th className="px-3 py-2 font-semibold">Lokasi</th>
              <th className="px-3 py-2 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-3">{i + 1}</td>
                <td className="px-3 py-3 min-w-[200px]">{d.nama}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${warnaKategori[d.kategori]}`}>
                    {d.kategori}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{d.tanggal}</td>
                <td className="px-3 py-3 min-w-[150px]">{d.lokasi}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${warnaTipe[d.tipe]}`}>
                      {d.tipe}
                    </span>
                    <Link
                      to="/dokumen-arsip"
                      className="w-7 h-7 rounded bg-hijau hover:bg-hijau-tua text-white flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Link
          to="/dokumen-arsip"
          className="border border-hijau text-hijau hover:bg-green-50 px-5 py-2 rounded-md text-sm font-medium transition"
        >
          Lihat Semua Dokumen
        </Link>
      </div>
    </div>
  );
}
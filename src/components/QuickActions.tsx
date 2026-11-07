import { Link } from "react-router-dom";
import { CloudUpload, Search, Folder, Send } from "lucide-react";

const aksi = [
  { to: "/upload-dokumen", label: "Upload Dokumen", icon: CloudUpload, style: "bg-green-50 text-green-600" },
  { to: "/cari-dokumen", label: "Cari Dokumen", icon: Search, style: "bg-blue-50 text-blue-600" },
  { to: "/laporan-arsip", label: "Lihat Laporan", icon: Folder, style: "bg-purple-50 text-purple-600" },
  { to: "/surat-keluar", label: "Buat Surat Keluar", icon: Send, style: "bg-orange-50 text-orange-500" },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="font-bold text-hijau mb-4">Aksi Cepat</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {aksi.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={`rounded-lg p-3 flex flex-col items-center text-center gap-2 text-sm text-gray-700 hover:shadow-md transition ${a.style}`}
          >
            <a.icon className="w-7 h-7" />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
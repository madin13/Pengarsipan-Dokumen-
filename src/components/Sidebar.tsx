import { NavLink, useNavigate } from "react-router-dom";
import {
  House, Users, User, Mail, Send, Folder,
  CloudUpload, Search, ChartColumn, LogOut,
} from "lucide-react";
import { usePengguna } from "../userStore";

const menu = [
  { to: "/dashboard", label: "Beranda", icon: House },
  { to: "/data-siswa", label: "Data Siswa", icon: Users },
  { to: "/data-guru", label: "Data Guru", icon: User },
  { to: "/surat-masuk", label: "Surat Masuk", icon: Mail },
  { to: "/surat-keluar", label: "Surat Keluar", icon: Send },
  { to: "/dokumen-arsip", label: "Dokumen Arsip", icon: Folder },
  { to: "/upload-dokumen", label: "Upload Dokumen", icon: CloudUpload },
  { to: "/cari-dokumen", label: "Cari Dokumen", icon: Search },
  { to: "/laporan-arsip", label: "Laporan Arsip", icon: ChartColumn },
];

export default function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const pengguna = usePengguna();

  // Hanya tampilkan menu yang boleh diakses peran ini
  const menuBoleh = menu.filter((m) => pengguna.menu.includes(m.to));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col overflow-y-auto transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 pt-6 pb-4">
        <img src="/logo tk .jpeg" alt="Logo" className="w-28 h-28 rounded-full object-cover" />
        <h2 className="mt-3 font-extrabold text-hijau leading-tight">
          SISTEM INFORMASI <br /> PENGARSIPAN DOKUMEN
        </h2>
        <p className="mt-1 text-sm text-hijau-tua">TK Tunas Kintamani 2</p>
      </div>

      <hr className="mx-4 border-gray-100" />

      <nav className="flex-1 p-3 space-y-1">
        {menuBoleh.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition ${
                isActive ? "bg-hijau text-white" : "text-gray-700 hover:bg-green-50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}

        <hr className="my-3 border-gray-100" />

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
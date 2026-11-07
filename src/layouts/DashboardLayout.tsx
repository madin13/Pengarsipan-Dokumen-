import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { bolehAkses, usePengguna } from "../userStore";

export default function DashboardLayout() {
  const [open, setOpen] = useState(window.innerWidth >= 1024);
  const pengguna = usePengguna();
  const { pathname } = useLocation();

  // Penjaga halaman berdasarkan peran
  if (!bolehAkses(pengguna, pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} />

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`transition-all duration-300 ${open ? "lg:ml-60" : "lg:ml-0"}`}>
        <Topbar onToggle={() => setOpen(!open)} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>

        <footer className="px-6 pb-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-500">
          <span>© 2025 TK Tunas Kintamani 2. All rights reserved.</span>
          <span>Sistem Informasi Pengarsipan Dokumen v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataSiswa from "./pages/DataSiswa";
import DataGuru from "./pages/DataGuru";
import SuratMasukPage from "./pages/SuratMasuk";
import SuratKeluarPage from "./pages/SuratKeluar";
import DokumenArsip from "./pages/DokumenArsip";
import UploadDokumen from "./pages/UploadDokumen";
import CariDokumen from "./pages/CariDokumen";
import LaporanArsip from "./pages/LaporanArsip";
import CetakLaporan from "./pages/CetakLaporan";
import DashboardLayout from "./layouts/DashboardLayout";

// Halaman sementara untuk menu yang belum dibuat
function Placeholder() {
  return (
    <div className="bg-white rounded-xl p-8 text-gray-600 shadow-sm">
      Halaman ini sedang dalam pengembangan.
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-siswa" element={<DataSiswa />} />
        <Route path="/data-guru" element={<DataGuru />} />
        <Route path="/surat-masuk" element={<SuratMasukPage />} />
        <Route path="/surat-keluar" element={<SuratKeluarPage />} />
        <Route path="/dokumen-arsip" element={<DokumenArsip />} />
        <Route path="/upload-dokumen" element={<UploadDokumen />} />
        <Route path="/cari-dokumen" element={<CariDokumen />} />
        <Route path="/laporan-arsip" element={<LaporanArsip />} />
        <Route path="/laporan-arsip/cetak" element={<CetakLaporan />} />
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}

export default App;
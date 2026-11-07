import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Info, Folder, FileText, Send, Archive } from "lucide-react";
import KartuRingkas from "../components/KartuRingkas";
import { dataAwal } from "./DokumenArsip";
import { ambilArsip } from "../arsipStore";
import {
  filterAwal, saring, ringkasan, periodeTeks, waktuSekarang, ukuranTeks,
  SURAT_MASUK, SURAT_KELUAR, type FilterLaporan,
} from "../laporan";

export default function CetakLaporan() {
  const navigate = useNavigate();
  const lokasi = useLocation();
  const filter = (lokasi.state as FilterLaporan | null) ?? filterAwal;

  const [semua] = useState(() => ambilArsip() ?? dataAwal);
  const [waktu] = useState(waktuSekarang());
  const [layout, setLayout] = useState<"portrait" | "landscape">("portrait");
  const [kop, setKop] = useState(true);
  const [kartu, setKartu] = useState(true);

  const data = saring(semua, filter);
  const { total, baris, totalUkuran } = ringkasan(data);

  return (
    <div className="space-y-6">
      {/* Mengatur ukuran dan arah kertas saat mencetak */}
      <style>{`@page { size: A4 ${layout}; margin: 12mm; }`}</style>

      <div>
        <h1 className="text-3xl font-bold text-hijau">Cetak Laporan Arsip</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/laporan-arsip" className="hover:underline">Laporan Arsip</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Cetak Laporan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ===== Pratinjau ===== */}
        <div className="bg-gray-200 rounded-xl p-4 md:p-6">
          <div id="area-cetak" className="bg-white mx-auto max-w-3xl p-8 text-gray-900 shadow">
            {kop && (
              <div className="flex items-center gap-5 border-b-2 border-gray-900 pb-4">
                <img src="/logo tk .jpeg" alt="Logo" className="w-24 h-24 rounded-full object-cover" />
                <div className="text-sm leading-snug">
                  <h2 className="text-xl font-bold">TK TUNAS KINTAMANI 2</h2>
                  <p>Jl. Raya Taman Rawa Kalong No. 45, Taman Rawa, Kec. Setu</p>
                  <p>Kota Jakarta Timur, DKI Jakarta 13880</p>
                  <p>Telp. (021) 12345678 | Email: info@tktunaskintamani2.sch.id</p>
                </div>
              </div>
            )}

            <div className="text-center mt-5">
              <h3 className="text-lg font-bold">LAPORAN ARSIP</h3>
              <p className="text-sm font-semibold">Periode: {periodeTeks(filter)}</p>
              <p className="text-sm">Tanggal Cetak: {waktu}</p>
            </div>

            {kartu && (
              <div className="grid grid-cols-5 gap-2 mt-5">
                <KartuRingkas kecil icon={Folder} label="Total Dokumen" value={String(total)} unit="dokumen"
                  bg="bg-white" iconStyle="bg-green-100 text-green-600" valueColor="text-green-700" />
                <KartuRingkas kecil icon={FileText} label="Surat Masuk" value={String(SURAT_MASUK)} unit="dokumen"
                  bg="bg-white" iconStyle="bg-blue-100 text-blue-600" valueColor="text-blue-700" />
                <KartuRingkas kecil icon={Send} label="Surat Keluar" value={String(SURAT_KELUAR)} unit="dokumen"
                  bg="bg-white" iconStyle="bg-orange-100 text-orange-500" valueColor="text-orange-500" />
                <KartuRingkas kecil icon={Folder} label="Dokumen Arsip" value={String(total)} unit="dokumen"
                  bg="bg-white" iconStyle="bg-purple-100 text-purple-600" valueColor="text-purple-600" />
                <KartuRingkas kecil icon={Archive} label="Penyimpanan" value={ukuranTeks(totalUkuran)} unit="terpakai"
                  bg="bg-white" iconStyle="bg-teal-100 text-teal-600" valueColor="text-teal-700" />
              </div>
            )}

            <h4 className="font-bold mt-6 mb-2">Rincian Arsip per Kategori</h4>
            <table className="w-full text-sm border border-gray-400 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-1.5 text-left">No</th>
                  <th className="border border-gray-400 px-2 py-1.5 text-left">Kategori</th>
                  <th className="border border-gray-400 px-2 py-1.5">Jumlah Dokumen</th>
                  <th className="border border-gray-400 px-2 py-1.5">Persentase</th>
                  <th className="border border-gray-400 px-2 py-1.5">Ukuran (MB)</th>
                </tr>
              </thead>
              <tbody>
                {baris.map((b, i) => (
                  <tr key={b.kategori}>
                    <td className="border border-gray-400 px-2 py-1.5">{i + 1}</td>
                    <td className="border border-gray-400 px-2 py-1.5">{b.kategori}</td>
                    <td className="border border-gray-400 px-2 py-1.5 text-center">{b.jumlah}</td>
                    <td className="border border-gray-400 px-2 py-1.5 text-center">{b.persen.toFixed(1)}%</td>
                    <td className="border border-gray-400 px-2 py-1.5 text-center">{b.ukuran.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border border-gray-400 px-2 py-1.5" colSpan={2}>Total</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{total}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{total ? "100%" : "0%"}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{totalUkuran.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-10 text-sm flex justify-end">
              <div className="text-center">
                <p>Jakarta, {waktu.split(",")[0]}</p>
                <p>Admin Tata Usaha</p>
                <div className="h-16" />
                <p className="font-semibold">(............................)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Panel opsi ===== */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-fit space-y-5">
          <h3 className="text-xl font-bold text-gray-800">Pengaturan Cetak</h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Layout</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-sm"
              value={layout}
              onChange={(e) => setLayout(e.target.value as "portrait" | "landscape")}
            >
              <option value="portrait">Potret</option>
              <option value="landscape">Lanskap</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Opsi</p>
            <label className="flex items-center gap-3 mb-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={kop} onChange={(e) => setKop(e.target.checked)}
                className="w-5 h-5 accent-green-700" />
              Kop surat sekolah
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={kartu} onChange={(e) => setKartu(e.target.checked)}
                className="w-5 h-5 accent-green-700" />
              Kartu ringkasan
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Ukuran kertas A4. Pilih printer atau &quot;Simpan sebagai PDF&quot; pada jendela cetak browser.
          </p>

          <div className="flex justify-end gap-3">
            <button onClick={() => navigate("/laporan-arsip")}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
              Batal
            </button>
            <button onClick={() => window.print()}
              className="px-6 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-semibold">
              Cetak
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Info className="w-4 h-4 shrink-0" />
        <span><b>Catatan:</b> Pastikan data laporan sudah sesuai sebelum melakukan pencetakan.</span>
      </div>
    </div>
  );
}
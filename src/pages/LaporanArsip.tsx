import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronDown, Search, Download, Printer, Eye, Info,
  Folder, FileText, Send, Archive, Calendar, User,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import KartuRingkas from "../components/KartuRingkas";
import { daftarKategori } from "../components/ArsipModal";
import { dataAwal } from "./DokumenArsip";
import { ambilArsip } from "../arsipStore";
import {
  filterAwal, saring, ringkasan, perBulan, periodeTeks, waktuSekarang,
  warnaKategori, jenisFile, ukuranTeks, SURAT_MASUK, SURAT_KELUAR,
  type FilterLaporan,
} from "../laporan";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700 bg-white text-sm";

const daftarJenis = ["PDF", "DOC", "DOCX", "XLS", "XLSX", "JPG", "PNG"];

export default function LaporanArsip() {
  const navigate = useNavigate();
  const [semua] = useState(() => ambilArsip() ?? dataAwal);

  const [form, setForm] = useState<FilterLaporan>(filterAwal);
  const [aktif, setAktif] = useState<FilterLaporan>(filterAwal);
  const [menuBuka, setMenuBuka] = useState(false);
  const [waktu, setWaktu] = useState(waktuSekarang());

  const tahunTersedia = Array.from(new Set(semua.map((a) => a.tanggal.slice(0, 4)))).sort().reverse();
  const [tahun, setTahun] = useState(tahunTersedia[0] ?? String(new Date().getFullYear()));

  const data = saring(semua, aktif);
  const { total, baris, totalUkuran } = ringkasan(data);
  const dataPie = baris.filter((b) => b.jumlah > 0);
  const tren = perBulan(semua, tahun);

  // Setiap perubahan filter langsung diterapkan
  const ubah = (baru: FilterLaporan) => {
    setForm(baru);
    setAktif(baru);
    setWaktu(waktuSekarang());
  };

  const tampilkan = () => {
    setAktif(form);
    setWaktu(waktuSekarang());
  };

  const cetak = () => navigate("/laporan-arsip/cetak", { state: aktif });

  const unduhCSV = () => {
    const kepala = ["Kode Arsip", "Nama Dokumen", "Kategori", "Tanggal", "Lokasi", "Jenis File"];
    const isi = data.map((a) => [
      a.kode, a.nama, a.kategori, a.tanggal,
      `${a.lemari} ${a.rak} - ${a.map}`, jenisFile(a.namaFile),
    ]);
    const csv = [kepala, ...isi]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-arsip.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMenuBuka(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Laporan Arsip</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Laporan Arsip</span>
        </div>
      </div>

      {/* ===== Filter ===== */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Periode</label>
            <div className="flex items-center gap-1">
              <input type="date" className={inputClass} value={form.dari}
                onChange={(e) => ubah({ ...form, dari: e.target.value })} />
              <span className="text-gray-400">-</span>
              <input type="date" className={inputClass} value={form.sampai}
                onChange={(e) => ubah({ ...form, sampai: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Kategori</label>
            <select className={inputClass} value={form.kategori}
              onChange={(e) => ubah({ ...form, kategori: e.target.value })}>
              <option value="">Semua Kategori</option>
              {daftarKategori.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Jenis Dokumen</label>
            <select className={inputClass} value={form.jenis}
              onChange={(e) => ubah({ ...form, jenis: e.target.value })}>
              <option value="">Semua Jenis</option>
              {daftarJenis.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>

          <button
            onClick={tampilkan}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-semibold"
          >
            <Search className="w-4 h-4" />
            Tampilkan Laporan
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuBuka(!menuBuka)}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            {menuBuka && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button onClick={unduhCSV}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50">
                  <Download className="w-4 h-4" /> Unduh CSV (Excel)
                </button>
                <button onClick={cetak}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50">
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Laporan data per {waktu}</p>
      </div>

      {/* ===== Kartu ringkas ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        <KartuRingkas icon={Folder} label="Total Dokumen" value={String(total)} unit="dokumen"
          bg="bg-green-50/60" iconStyle="bg-green-100 text-green-600" valueColor="text-green-700" />
        <KartuRingkas icon={FileText} label="Surat Masuk" value={String(SURAT_MASUK)} unit="dokumen"
          bg="bg-blue-50/60" iconStyle="bg-blue-100 text-blue-600" valueColor="text-blue-700" />
        <KartuRingkas icon={Send} label="Surat Keluar" value={String(SURAT_KELUAR)} unit="dokumen"
          bg="bg-orange-50/60" iconStyle="bg-orange-100 text-orange-500" valueColor="text-orange-500" />
        <KartuRingkas icon={Folder} label="Dokumen Arsip" value={String(total)} unit="dokumen"
          bg="bg-purple-50/60" iconStyle="bg-purple-100 text-purple-600" valueColor="text-purple-600" />
        <KartuRingkas icon={Archive} label="Ukuran Penyimpanan" value={ukuranTeks(totalUkuran)} unit="terpakai"
          bg="bg-teal-50/60" iconStyle="bg-teal-100 text-teal-600" valueColor="text-teal-700" />
      </div>

      {/* ===== Grafik ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-bold text-hijau mb-4">Distribusi Dokumen per Kategori</h3>

          {total === 0 ? (
            <p className="text-center text-gray-500 py-16">Tidak ada data.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataPie} dataKey="jumlah" nameKey="kategori"
                      innerRadius={52} outerRadius={90} stroke="none">
                      {dataPie.map((b) => (
                        <Cell key={b.kategori} fill={warnaKategori[b.kategori]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-800">{total}</span>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
              </div>

              <ul className="flex-1 w-full space-y-1.5 text-xs">
                {baris.map((b) => (
                  <li key={b.kategori} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0"
                      style={{ background: warnaKategori[b.kategori] }} />
                    <span className="flex-1 text-gray-700">{b.kategori}</span>
                    <span className="text-gray-600">
                      {b.jumlah} ({b.persen.toFixed(1)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-hijau">Tren Arsip per Bulan</h3>
            <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 outline-none"
              value={tahun} onChange={(e) => setTahun(e.target.value)}>
              {tahunTersedia.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tren} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="bulan" tickLine={false} axisLine={false}
                  tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.split(" ")[0]} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="jumlah" name="Dokumen"
                  stroke="#3f8a2f" fill="#3f8a2f" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== Rincian + Informasi ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-bold text-hijau mb-4">Rincian Arsip per Kategori</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50 text-left text-hijau-tua">
                  <th className="px-3 py-2.5 font-semibold">No</th>
                  <th className="px-3 py-2.5 font-semibold">Kategori</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Jumlah Dokumen</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Persentase</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Ukuran (MB)</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {baris.map((b, i) => (
                  <tr key={b.kategori} className="border-b border-gray-100">
                    <td className="px-3 py-2.5">{i + 1}</td>
                    <td className="px-3 py-2.5">{b.kategori}</td>
                    <td className="px-3 py-2.5 text-center">{b.jumlah}</td>
                    <td className="px-3 py-2.5 text-center">{b.persen.toFixed(1)}%</td>
                    <td className="px-3 py-2.5 text-center">{b.ukuran.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <Link to="/dokumen-arsip"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-green-300 text-hijau text-xs hover:bg-green-50">
                        <Eye className="w-3 h-3" /> Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-3 py-3" colSpan={2}>Total</td>
                  <td className="px-3 py-3 text-center">{total}</td>
                  <td className="px-3 py-3 text-center">{total ? "100%" : "0%"}</td>
                  <td className="px-3 py-3 text-center">{totalUkuran.toFixed(2)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-bold text-hijau mb-4">Informasi Laporan</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Periode Laporan</p>
                <p className="text-gray-600">{periodeTeks(aktif)}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <FileText className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Total Dokumen</p>
                <p className="text-gray-600">{total} dokumen</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Tanggal Dibuat</p>
                <p className="text-gray-600">{waktu}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <User className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Dibuat Oleh</p>
                <p className="text-gray-600">Admin Tata Usaha</p>
              </div>
            </li>
          </ul>

          <div className="mt-5 flex gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            Data laporan diperbarui secara otomatis setiap kali ada penambahan arsip baru.
          </div>
        </div>
      </div>
    </div>
  );
}
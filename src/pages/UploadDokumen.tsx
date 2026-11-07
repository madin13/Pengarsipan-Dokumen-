import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, CloudUpload, Upload, FileText, X, CheckCircle2, Info,
  FileCheck, Folder, Calendar, MapPin, FileType, HardDrive,
} from "lucide-react";
import { daftarKategori, type Arsip } from "../components/ArsipModal";
import { dataAwal } from "./DokumenArsip";
import { ambilArsip, simpanArsip, buatKode } from "../arsipStore";
import { tambahNotifikasi } from "../notifikasiStore";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700 placeholder:text-gray-400";

const BATAS_MB = 10;
const EKSTENSI_BOLEH = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"];

// Pilihan lokasi: [lemari, rak, map]
const daftarLokasi: [string, string, string][] = [];
for (const [lemari, raks] of [
  ["Lemari Arsip 1", ["Rak A"]],
  ["Lemari Arsip 2", ["Rak B"]],
  ["Lemari Arsip 3", ["Rak C"]],
  ["Lemari Arsip 4", ["Rak D"]],
] as [string, string[]][]) {
  for (const rak of raks) {
    for (const map of ["Map 01", "Map 02", "Map 03"]) {
      daftarLokasi.push([lemari, rak, map]);
    }
  }
}

const panduan = [
  { ikon: FileCheck, judul: "Pastikan nama dokumen jelas dan sesuai", isi: "Gunakan nama yang deskriptif agar dokumen mudah ditemukan." },
  { ikon: Folder, judul: "Pilih kategori yang tepat", isi: "Kategori membantu dalam pengelompokan dan pencarian dokumen." },
  { ikon: Calendar, judul: "Periksa tanggal dokumen", isi: "Tanggal dokumen harus sesuai dengan tanggal pembuatan/terbit dokumen." },
  { ikon: MapPin, judul: "Pilih lokasi penyimpanan yang sesuai", isi: "Tentukan lemari arsip, rak, dan map tempat dokumen disimpan." },
  { ikon: FileType, judul: "Gunakan format file yang didukung", isi: "Format yang diperbolehkan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG." },
  { ikon: HardDrive, judul: "Ukuran file maksimal 10 MB", isi: "Pastikan ukuran file tidak melebihi batas yang ditentukan." },
];

const ukuran = (byte: number) =>
  byte > 1024 * 1024
    ? `${(byte / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(byte / 1024))} KB`;

const Wajib = () => <span className="text-red-500"> *</span>;

export default function UploadDokumen() {
  const navigate = useNavigate();
  const inputFile = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [seret, setSeret] = useState(false);
  const [error, setError] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState(""); // indeks di daftarLokasi, "" = belum dipilih

  const pilih = (f: File | undefined) => {
    if (!f) return;
    const ekstensi = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!EKSTENSI_BOLEH.includes(ekstensi)) {
      setError("Format file harus PDF, DOC, DOCX, XLS, XLSX, JPG, atau PNG.");
      return;
    }
    if (f.size > BATAS_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${BATAS_MB} MB.`);
      return;
    }
    setError("");
    setFile(f);
  };

  const lepas = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSeret(false);
    pilih(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setFile(null);
    setNama("");
    setKategori("");
    setDeskripsi("");
    setTanggal("");
    setLokasi("");
    setError("");
    if (inputFile.current) inputFile.current.value = "";
  };

  const kirim = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("File dokumen wajib dipilih.");
      return;
    }

    const [lemari, rak, map] = daftarLokasi[Number(lokasi)];
    const daftar = ambilArsip() ?? dataAwal;

    const baru: Arsip = {
      id: Math.max(0, ...daftar.map((a) => a.id)) + 1,
      kode: buatKode(daftar),
      nama, kategori, deskripsi, tanggal, lemari, rak, map,
      namaFile: file.name,
      urlFile: URL.createObjectURL(file),
    };

    simpanArsip([baru, ...daftar]);
    tambahNotifikasi({ judul: "Dokumen berhasil diupload", isi: nama, ke: "/dokumen-arsip" });
    setBerhasil(true);
  };

  // ===== Tampilan setelah berhasil =====
  if (berhasil) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-100 p-10 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-hijau mx-auto" />
        <h2 className="text-2xl font-bold text-hijau">Dokumen berhasil diupload</h2>
        <p className="text-gray-600">
          Dokumen <b>{nama}</b> sudah masuk ke Daftar Dokumen Arsip.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => { reset(); setBerhasil(false); }}
            className="px-5 py-2.5 rounded-lg border border-hijau text-hijau hover:bg-green-50 font-medium"
          >
            Upload Lagi
          </button>
          <button
            onClick={() => navigate("/dokumen-arsip")}
            className="px-5 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-medium"
          >
            Lihat Dokumen Arsip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Upload Dokumen</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Upload Dokumen</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ===== KIRI: Form ===== */}
        <form
          onSubmit={kirim}
          className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 space-y-5"
        >
          <h3 className="text-xl font-bold text-hijau">Form Upload Dokumen</h3>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Nama Dokumen<Wajib />
            </label>
            <input required className={inputClass} value={nama}
              onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama dokumen" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Kategori<Wajib />
            </label>
            <select required className={inputClass} value={kategori}
              onChange={(e) => setKategori(e.target.value)}>
              <option value="" disabled>Pilih kategori dokumen</option>
              {daftarKategori.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Deskripsi (Opsional)
            </label>
            <textarea rows={3} className={inputClass} value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Masukkan deskripsi dokumen" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Tanggal Dokumen<Wajib />
              </label>
              <input required type="date" className={inputClass} value={tanggal}
                onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Lokasi Penyimpanan<Wajib />
              </label>
              <select required className={inputClass} value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}>
                <option value="" disabled>Pilih lokasi penyimpanan</option>
                {daftarLokasi.map(([lemari, rak, map], i) => (
                  <option key={i} value={i}>{lemari} - {rak} - {map}</option>
                ))}
              </select>
            </div>
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              File Dokumen<Wajib />
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setSeret(true); }}
              onDragLeave={() => setSeret(false)}
              onDrop={lepas}
              onClick={() => inputFile.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
                seret ? "border-hijau bg-green-50" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <CloudUpload className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="mt-3 font-semibold text-gray-800">
                Klik atau seret file ke sini untuk mengupload
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
              <p className="mt-1 text-sm text-gray-500">Maksimal ukuran file {BATAS_MB} MB</p>
              <input
                ref={inputFile}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => pilih(e.target.files?.[0])}
              />
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {file && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-hijau flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{ukuran(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (inputFile.current) inputFile.current.value = "";
                  }}
                  title="Hapus file"
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { reset(); navigate("/dashboard"); }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-semibold"
            >
              <Upload className="w-5 h-5" />
              Upload Dokumen
            </button>
          </div>
        </form>

        {/* ===== KANAN: Panduan ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-hijau mb-5">Panduan Upload</h3>

          <ul className="space-y-5">
            {panduan.map((p) => (
              <li key={p.judul} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-green-100 text-hijau flex items-center justify-center shrink-0">
                  <p.ikon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.judul}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{p.isi}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
              <Info className="w-5 h-5" />
              Informasi
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Dokumen yang berhasil diupload akan otomatis masuk ke dalam Daftar Dokumen Arsip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
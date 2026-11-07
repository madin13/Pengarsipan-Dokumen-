import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, FileText,
} from "lucide-react";
import SuratKeluarModal, { type SuratKeluar } from "../components/SuratKeluarModal";
import { tambahNotifikasi } from "../notifikasiStore";

const buat = (
  id: number, noSurat: string, tanggalKirim: string, tujuan: string,
  perihal: string, klasifikasi: string
): SuratKeluar => ({
  id, noSurat, tanggalKirim, tujuan, perihal, klasifikasi,
  namaFile: `surat-keluar-${id}.pdf`,
  urlFile: "",
});

const dataAwal: SuratKeluar[] = [
  buat(1, "012/SK/05/2025", "2025-05-31", "Orang Tua/Wali Siswa", "Undangan Rapat Orang Tua", "Undangan"),
  buat(2, "011/SK/05/2025", "2025-05-26", "Dinas Pendidikan DKI Jakarta", "Permohonan Bantuan Alat Peraga Edukatif", "Permohonan"),
  buat(3, "010/SK/05/2025", "2025-05-20", "Orang Tua/Wali Siswa", "Pemberitahuan Libur Kenaikan Kelas", "Pemberitahuan"),
  buat(4, "009/SK/05/2025", "2025-05-14", "Puskesmas Cempaka Putih", "Permohonan Pemeriksaan Kesehatan Anak", "Permohonan"),
  buat(5, "008/SK/04/2025", "2025-04-29", "Orang Tua/Wali Siswa", "Edaran Kegiatan Wisuda dan Perpisahan", "Edaran"),
  buat(6, "007/SK/04/2025", "2025-04-22", "Siti Rahma (Wali Murid)", "Surat Keterangan Siswa Aktif", "Keterangan"),
  buat(7, "006/SK/04/2025", "2025-04-15", "Dinas Pemadam Kebakaran DKI Jakarta", "Konfirmasi Kehadiran Simulasi Kebakaran", "Pemberitahuan"),
  buat(8, "005/SK/04/2025", "2025-04-08", "Orang Tua/Wali Siswa", "Undangan Pentas Seni Akhir Tahun", "Undangan"),
  buat(9, "004/SK/03/2025", "2025-03-27", "Bank DKI", "Permohonan Pembukaan Rekening Tabungan Siswa", "Permohonan"),
  buat(10, "003/SK/03/2025", "2025-03-12", "Orang Tua/Wali Siswa", "Edaran Pembayaran Kegiatan Semester 2", "Edaran"),
];

const PER_HALAMAN = 8;

const formatTanggal = (t: string) => t.split("-").reverse().join("-");

export default function SuratKeluarPage() {
  const [surat, setSurat] = useState<SuratKeluar[]>(dataAwal);
  const [cari, setCari] = useState("");
  const [halaman, setHalaman] = useState(1);

  const [modalBuka, setModalBuka] = useState(false);
  const [dipilih, setDipilih] = useState<SuratKeluar | null>(null);

  const hasil = surat.filter((s) =>
    (s.noSurat + s.tujuan + s.perihal + s.klasifikasi)
      .toLowerCase()
      .includes(cari.toLowerCase())
  );

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

  const bukaTambah = () => {
    setDipilih(null);
    setModalBuka(true);
  };

  const bukaEdit = (s: SuratKeluar) => {
    setDipilih(s);
    setModalBuka(true);
  };

  const simpan = (data: Omit<SuratKeluar, "id">) => {
    if (dipilih) {
      setSurat(surat.map((s) => (s.id === dipilih.id ? { ...s, ...data } : s)));
    } else {
      const idBaru = Math.max(0, ...surat.map((s) => s.id)) + 1;
      setSurat([{ id: idBaru, ...data }, ...surat]);
      tambahNotifikasi({
        judul: "Surat Keluar baru dibuat",
        isi: data.perihal,
        ke: "/surat-keluar",
      });
    }
    setModalBuka(false);
  };

  const hapus = (s: SuratKeluar) => {
    if (confirm(`Hapus surat "${s.noSurat}"?`)) {
      setSurat(surat.filter((x) => x.id !== s.id));
    }
  };

  const bukaFile = (s: SuratKeluar) => {
    if (s.urlFile) {
      window.open(s.urlFile, "_blank");
    } else {
      alert("Ini data contoh, belum ada file PDF yang diupload.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Surat Keluar</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Surat Keluar</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <button
            onClick={bukaTambah}
            className="flex items-center justify-center gap-2 bg-hijau hover:bg-hijau-tua text-white font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Tambah Surat Keluar
          </button>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 sm:w-72 focus-within:ring-2 focus-within:ring-hijau">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHalaman(1); }}
              placeholder="Cari surat keluar..."
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-left text-hijau-tua">
                <th className="px-3 py-3 font-semibold">No</th>
                <th className="px-3 py-3 font-semibold">No. Surat</th>
                <th className="px-3 py-3 font-semibold">Tanggal Kirim</th>
                <th className="px-3 py-3 font-semibold">Tujuan Surat</th>
                <th className="px-3 py-3 font-semibold">Perihal</th>
                <th className="px-3 py-3 font-semibold">Klasifikasi</th>
                <th className="px-3 py-3 font-semibold">File</th>
                <th className="px-3 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Data surat keluar tidak ditemukan.
                  </td>
                </tr>
              )}

              {tampil.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-4">{mulai + i + 1}</td>
                  <td className="px-3 py-4 whitespace-nowrap">{s.noSurat}</td>
                  <td className="px-3 py-4 whitespace-nowrap">{formatTanggal(s.tanggalKirim)}</td>
                  <td className="px-3 py-4 min-w-[160px]">{s.tujuan}</td>
                  <td className="px-3 py-4 min-w-[200px]">{s.perihal}</td>
                  <td className="px-3 py-4">{s.klasifikasi}</td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => bukaFile(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100"
                    >
                      <FileText className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => bukaEdit(s)}
                        title="Edit"
                        className="w-8 h-8 rounded-md bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => hapus(s)}
                        title="Hapus"
                        className="w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <p className="text-sm text-gray-600">
            Menampilkan {hasil.length === 0 ? 0 : mulai + 1} sampai{" "}
            {Math.min(mulai + PER_HALAMAN, hasil.length)} dari {hasil.length} data
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHalaman(halamanAktif - 1)}
              disabled={halamanAktif === 1}
              className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalHalaman }, (_, n) => n + 1).map((n) => (
              <button
                key={n}
                onClick={() => setHalaman(n)}
                className={`w-9 h-9 rounded-md border text-sm font-medium ${
                  n === halamanAktif
                    ? "bg-hijau border-hijau text-white"
                    : "border-gray-300 text-gray-700 hover:bg-green-50"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setHalaman(halamanAktif + 1)}
              disabled={halamanAktif === totalHalaman}
              className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SuratKeluarModal
        open={modalBuka}
        data={dipilih}
        onClose={() => setModalBuka(false)}
        onSave={simpan}
      />
    </div>
  );
}
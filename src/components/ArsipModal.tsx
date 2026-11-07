import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type Arsip = {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  deskripsi?: string;   // <-- tambah (tanda ? artinya boleh kosong)
  tanggal: string; // yyyy-mm-dd
  lemari: string;
  rak: string;
  map: string;
  namaFile: string;
  urlFile: string;
};  

export const daftarKategori = [
  "Perencanaan",
  "Pembelajaran",
  "Administrasi",
  "Akademik",
  "Legalitas",
  "Kelembagaan",
  "Dokumentasi",
  "Keuangan",
];

type Props = {
  open: boolean;
  data: Arsip | null; // null = mode tambah
  kodeBaru: string;   // kode otomatis untuk data baru
  onClose: () => void;
  onSave: (arsip: Omit<Arsip, "id">) => void;
};

const kosong: Omit<Arsip, "id"> = {
  kode: "",
  nama: "",
  kategori: "Perencanaan",
  tanggal: "",
  lemari: "Lemari Arsip 1",
  rak: "Rak A",
  map: "Map 01",
  namaFile: "",
  urlFile: "",
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700";

export default function ArsipModal({ open, data, kodeBaru, onClose, onSave }: Props) {
  const [form, setForm] = useState(kosong);

  useEffect(() => {
    if (open) {
      if (data) {
        const { id, ...sisa } = data;
        void id;
        setForm(sisa);
      } else {
        setForm({ ...kosong, kode: kodeBaru });
      }
    }
  }, [open, data, kodeBaru]);

  if (!open) return null;

  const ubah = (field: keyof typeof kosong, nilai: string) =>
    setForm({ ...form, [field]: nilai });

  const pilihFile = (file: File | undefined) => {
    if (!file) return;
    setForm({
      ...form,
      namaFile: file.name,
      urlFile: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-hijau">
            {data ? "Edit Dokumen Arsip" : "Tambah Dokumen Arsip"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Kode Arsip</label>
            <input readOnly className={`${inputClass} bg-gray-50`} value={form.kode} />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Nama Dokumen</label>
            <input required className={inputClass} value={form.nama}
              onChange={(e) => ubah("nama", e.target.value)} placeholder="Nama dokumen" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Kategori</label>
              <select className={inputClass} value={form.kategori}
                onChange={(e) => ubah("kategori", e.target.value)}>
                {daftarKategori.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Tanggal Arsip</label>
              <input required type="date" className={inputClass} value={form.tanggal}
                onChange={(e) => ubah("tanggal", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Lokasi Penyimpanan</label>
            <div className="grid grid-cols-3 gap-3">
              <input required className={inputClass} value={form.lemari}
                onChange={(e) => ubah("lemari", e.target.value)} placeholder="Lemari" />
              <input required className={inputClass} value={form.rak}
                onChange={(e) => ubah("rak", e.target.value)} placeholder="Rak" />
              <input required className={inputClass} value={form.map}
                onChange={(e) => ubah("map", e.target.value)} placeholder="Map" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">File Dokumen</label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => pilihFile(e.target.files?.[0])}
              className="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-green-50 file:text-hijau file:font-medium hover:file:bg-green-100"
            />
            {form.namaFile && (
              <p className="mt-1 text-xs text-gray-500">File: {form.namaFile}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Batal
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-lg bg-hijau hover:bg-hijau-tua text-white font-semibold">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
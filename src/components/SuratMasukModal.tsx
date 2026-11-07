import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type SuratMasuk = {
  id: number;
  noSurat: string;
  tanggalTerima: string; // yyyy-mm-dd
  asal: string;
  perihal: string;
  klasifikasi: string;
  namaFile: string; // nama file PDF
  urlFile: string;  // alamat sementara file (kosong jika belum ada)
};

export const daftarKlasifikasi = [
  "Undangan",
  "Permohonan",
  "Pemberitahuan",
  "Penawaran",
];

type Props = {
  open: boolean;
  data: SuratMasuk | null; // null = mode tambah
  onClose: () => void;
  onSave: (surat: Omit<SuratMasuk, "id">) => void;
};

const kosong: Omit<SuratMasuk, "id"> = {
  noSurat: "",
  tanggalTerima: "",
  asal: "",
  perihal: "",
  klasifikasi: "Undangan",
  namaFile: "",
  urlFile: "",
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700";

export default function SuratMasukModal({ open, data, onClose, onSave }: Props) {
  const [form, setForm] = useState(kosong);

  useEffect(() => {
    if (open) {
      if (data) {
        const { id, ...sisa } = data;
        void id;
        setForm(sisa);
      } else {
        setForm(kosong);
      }
    }
  }, [open, data]);

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
            {data ? "Edit Surat Masuk" : "Tambah Surat Masuk"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">No. Surat</label>
            <input required className={inputClass} value={form.noSurat}
              onChange={(e) => ubah("noSurat", e.target.value)} placeholder="Contoh: 421/SM/05/2025" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Tanggal Terima</label>
              <input required type="date" className={inputClass} value={form.tanggalTerima}
                onChange={(e) => ubah("tanggalTerima", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Klasifikasi</label>
              <select className={inputClass} value={form.klasifikasi}
                onChange={(e) => ubah("klasifikasi", e.target.value)}>
                {daftarKlasifikasi.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Asal Surat</label>
            <input required className={inputClass} value={form.asal}
              onChange={(e) => ubah("asal", e.target.value)} placeholder="Contoh: Dinas Pendidikan DKI Jakarta" />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Perihal</label>
            <textarea required rows={2} className={inputClass} value={form.perihal}
              onChange={(e) => ubah("perihal", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">File Surat (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
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
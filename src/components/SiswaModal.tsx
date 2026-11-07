import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type Siswa = {
  id: number;
  nis: string;
  nama: string;
  jk: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string; // format yyyy-mm-dd
  alamat: string;
};

type Props = {
  open: boolean;
  data: Siswa | null; // null = mode tambah, ada isi = mode edit
  onClose: () => void;
  onSave: (siswa: Omit<Siswa, "id">) => void;
};

const kosong: Omit<Siswa, "id"> = {
  nis: "",
  nama: "",
  jk: "Laki-laki",
  tempatLahir: "",
  tanggalLahir: "",
  alamat: "",
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700";

export default function SiswaModal({ open, data, onClose, onSave }: Props) {
  const [form, setForm] = useState(kosong);

  // Isi form saat modal dibuka
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-hijau">
            {data ? "Edit Siswa" : "Tambah Siswa"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">NIS</label>
            <input required className={inputClass} value={form.nis}
              onChange={(e) => ubah("nis", e.target.value)} placeholder="Contoh: 009" />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Nama Siswa</label>
            <input required className={inputClass} value={form.nama}
              onChange={(e) => ubah("nama", e.target.value)} placeholder="Nama lengkap" />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Jenis Kelamin</label>
            <select className={inputClass} value={form.jk}
              onChange={(e) => ubah("jk", e.target.value)}>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Tempat Lahir</label>
              <input required className={inputClass} value={form.tempatLahir}
                onChange={(e) => ubah("tempatLahir", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Tanggal Lahir</label>
              <input required type="date" className={inputClass} value={form.tanggalLahir}
                onChange={(e) => ubah("tanggalLahir", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Alamat</label>
            <textarea required rows={2} className={inputClass} value={form.alamat}
              onChange={(e) => ubah("alamat", e.target.value)} />
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
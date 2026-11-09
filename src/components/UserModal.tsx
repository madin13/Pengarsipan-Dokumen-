import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { infoPeran, type Akun, type Peran } from "../userStore";

type Props = {
  open: boolean;
  data: Akun | null;      // null = mode tambah
  semua: Akun[];          // untuk cek username kembar
  onClose: () => void;
  onSave: (akun: Omit<Akun, "id">) => void;
};

const kosong: Omit<Akun, "id"> = {
  nama: "",
  username: "",
  peran: "guru",
  aktif: true,
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-hijau text-gray-700";

export default function UserModal({ open, data, semua, onClose, onSave }: Props) {
  const [form, setForm] = useState(kosong);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (data) {
        const { id, ...sisa } = data;
        void id;
        setForm(sisa);
      } else {
        setForm(kosong);
      }
      setError("");
    }
  }, [open, data]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = form.username.trim().toLowerCase();

    if (!/^[a-z0-9._-]{3,}$/.test(username)) {
      setError("Username minimal 3 karakter: huruf kecil, angka, titik, strip, atau garis bawah.");
      return;
    }
    if (semua.some((a) => a.username === username && a.id !== data?.id)) {
      setError("Username sudah dipakai akun lain.");
      return;
    }

    onSave({ ...form, nama: form.nama.trim(), username });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-hijau">
            {data ? "Edit User" : "Tambah User"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Nama Lengkap</label>
            <input required className={inputClass} value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama lengkap beserta gelar" />
          </div>

          <div>
            <label className="block text-sm font-medium text-hijau-tua mb-1">Username</label>
            <input required className={inputClass} value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Contoh: budi.santoso" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Peran</label>
              <select className={inputClass} value={form.peran}
                onChange={(e) => setForm({ ...form, peran: e.target.value as Peran })}>
                {(Object.keys(infoPeran) as Peran[]).map((p) => (
                  <option key={p} value={p}>{infoPeran[p].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hijau-tua mb-1">Status</label>
              <select className={inputClass} value={form.aktif ? "aktif" : "nonaktif"}
                onChange={(e) => setForm({ ...form, aktif: e.target.value === "aktif" })}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-500">{infoPeran[form.peran].deskripsi}</p>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
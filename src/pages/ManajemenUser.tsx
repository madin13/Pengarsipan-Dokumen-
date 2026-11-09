import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Pencil, Trash2, ChevronRight, ChevronLeft, ShieldCheck, Info, Loader2,
} from "lucide-react";
import { infoPeran, type Peran } from "../userStore";

// ===== Tipe data sesuai respon backend =====
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

// Isi VITE_API_URL di file .env, contoh: VITE_API_URL=http://localhost:3000
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const LIMIT = 5;

// Jika endpoint butuh token, sesuaikan nama key penyimpanannya
const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });

export default function ManajemenUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cari, setCari] = useState("");
  const [muatUlang, setMuatUlang] = useState(0); // naikkan nilainya untuk fetch ulang

  // ===== Ambil data dari backend =====
  useEffect(() => {
    const controller = new AbortController();

    const ambilUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/users?page=${page}&limit=${LIMIT}`, {
          headers: { "Content-Type": "application/json", ...authHeaders() },
          signal: controller.signal,
        });
        const json: UsersResponse = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Gagal mengambil data user");
        }
        setUsers(json.data);
        setPagination(json.pagination);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message || "Terjadi kesalahan");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    ambilUsers();
    return () => controller.abort();
  }, [page, muatUlang]);

  // Pencarian hanya menyaring data pada halaman yang sedang tampil.
  // Kalau backend punya parameter search, ganti dengan query ?search=
  const hasil = users.filter((u) =>
    (u.name + u.email).toLowerCase().includes(cari.toLowerCase())
  );

  const hapus = async (u: User) => {
    if (!confirm(`Hapus user "${u.name}"?`)) return;
    try {
      // Asumsi endpoint: DELETE /users/:id (sesuaikan dengan backend Anda)
      const res = await fetch(`${API_URL}/users/${u.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Gagal menghapus user");

      // Jika yang dihapus adalah satu-satunya data di halaman terakhir, mundur satu halaman
      if (users.length === 1 && page > 1) setPage(page - 1);
      else setMuatUlang((n) => n + 1);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const nomorAwal = pagination ? (pagination.page - 1) * pagination.limit : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-hijau">Manajemen User</h1>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <Link to="/dashboard" className="text-hijau font-medium hover:underline">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Manajemen User</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Daftar user ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <button
              onClick={() => {
                // TODO: hubungkan ke modal tambah user + POST /users
              }}
              className="flex items-center justify-center gap-2 bg-hijau hover:bg-hijau-tua text-white font-medium px-4 py-2.5 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Tambah User
            </button>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-hijau">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari user..."
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50 text-left text-hijau-tua">
                  <th className="px-3 py-3 font-semibold">No</th>
                  <th className="px-3 py-3 font-semibold">Nama</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="px-3 py-3 font-semibold">Dibuat</th>
                  <th className="px-3 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                      Memuat data...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-red-600">
                      {error}{" "}
                      <button
                        onClick={() => setMuatUlang((n) => n + 1)}
                        className="underline font-medium"
                      >
                        Coba lagi
                      </button>
                    </td>
                  </tr>
                )}

                {!loading && !error && hasil.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      User tidak ditemukan.
                    </td>
                  </tr>
                )}

                {!loading && !error && hasil.map((u, i) => (
                  <tr key={u.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-4">{nomorAwal + i + 1}</td>
                    <td className="px-3 py-4 min-w-[170px]">{u.name}</td>
                    <td className="px-3 py-4">{u.email}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{formatTanggal(u.createdAt)}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            // TODO: hubungkan ke modal edit + PUT/PATCH /users/:id
                          }}
                          title="Edit"
                          className="w-8 h-8 rounded-md bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => hapus(u)}
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

          {/* ===== Pagination ===== */}
          {pagination && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-600">
                Menampilkan {users.length} dari {pagination.totalItems} user
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>

                <span className="text-sm text-gray-700 px-2">
                  Halaman {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== Hak akses ===== */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-fit">
          <h3 className="font-bold text-hijau mb-4">Hak Akses per Peran</h3>

          <ul className="space-y-4">
            {(Object.keys(infoPeran) as Peran[]).map((p) => (
              <li key={p} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${infoPeran[p].warna}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{infoPeran[p].label}</p>
                  <p className="text-sm text-gray-600">{infoPeran[p].deskripsi}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            Untuk mencoba tampilan user lain, pilih akunnya lewat menu nama di kanan atas.
          </div>
        </div>
      </div>
    </div>
  );
}
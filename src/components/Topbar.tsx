import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, Bell, User, ChevronDown, CheckCheck, Trash2, Check, LogOut,
} from "lucide-react";
import {
  ambilNotifikasi, tandaiDibaca, tandaiSemuaDibaca, hapusSemua,
  waktuRelatif, EVENT_NOTIFIKASI, type Notifikasi,
} from "../notifikasiStore";
import { gantiPengguna, infoPeran, useDaftarAkun, usePengguna } from "../userStore";

export default function Topbar({ onToggle }: { onToggle: () => void }) {
  const navigate = useNavigate();
  const pengguna = usePengguna();
  const info = infoPeran[pengguna.peran];
  const semuaAkun = useDaftarAkun().filter((a) => a.aktif);

  const [daftar, setDaftar] = useState<Notifikasi[]>(() => ambilNotifikasi());
  const [bukaNotif, setBukaNotif] = useState(false);
  const [bukaAkun, setBukaAkun] = useState(false);
  const kotakNotif = useRef<HTMLDivElement>(null);
  const kotakAkun = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const segarkan = () => setDaftar(ambilNotifikasi());
    window.addEventListener(EVENT_NOTIFIKASI, segarkan);
    window.addEventListener("storage", segarkan);
    return () => {
      window.removeEventListener(EVENT_NOTIFIKASI, segarkan);
      window.removeEventListener("storage", segarkan);
    };
  }, []);

  useEffect(() => {
    const klikLuar = (e: MouseEvent) => {
      const t = e.target as Node;
      if (kotakNotif.current && !kotakNotif.current.contains(t)) setBukaNotif(false);
      if (kotakAkun.current && !kotakAkun.current.contains(t)) setBukaAkun(false);
    };
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  const belumDibaca = daftar.filter((n) => !n.dibaca).length;

  const bukaNotifikasi = (n: Notifikasi) => {
    tandaiDibaca(n.id);
    setBukaNotif(false);
    navigate(n.ke);
  };

  const pilihAkun = (id: number) => {
    gantiPengguna(id);
    setBukaAkun(false);
    navigate("/dashboard");
  };

  const keluar = () => {
    setBukaAkun(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-lg ${info.tombol} text-white flex items-center justify-center transition`}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-5">
        {/* ===== Notifikasi ===== */}
        <div className="relative" ref={kotakNotif}>
          <button
            onClick={() => { setBukaNotif(!bukaNotif); setBukaAkun(false); }}
            className="relative text-gray-600 hover:text-hijau"
            title="Notifikasi"
          >
            <Bell className="w-6 h-6" />
            {belumDibaca > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {belumDibaca > 9 ? "9+" : belumDibaca}
              </span>
            )}
          </button>

          {bukaNotif && (
            <div className="absolute right-0 top-full mt-3 w-[22rem] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h4 className="font-bold text-hijau">Notifikasi</h4>
                <span className="text-xs text-gray-500">{belumDibaca} belum dibaca</span>
              </div>

              <ul className="max-h-80 overflow-y-auto">
                {daftar.length === 0 && (
                  <li className="px-4 py-10 text-center text-sm text-gray-500">
                    Tidak ada notifikasi.
                  </li>
                )}

                {daftar.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => bukaNotifikasi(n)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-green-50 ${
                        n.dibaca ? "" : "bg-green-50/60"
                      }`}
                    >
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          n.dibaca ? "bg-transparent" : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{n.judul}</p>
                        <p className="text-sm text-gray-600 truncate">{n.isi}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{waktuRelatif(n.waktu)}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {daftar.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                  <button
                    onClick={tandaiSemuaDibaca}
                    className="flex items-center gap-1.5 text-xs font-medium text-hijau hover:underline"
                  >
                    <CheckCheck className="w-4 h-4" /> Tandai semua dibaca
                  </button>
                  <button
                    onClick={hapusSemua}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus semua
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Akun pengguna ===== */}
        <div className="relative" ref={kotakAkun}>
          <button
            onClick={() => { setBukaAkun(!bukaAkun); setBukaNotif(false); }}
            className="flex items-center gap-3 rounded-lg hover:bg-gray-50 px-1 py-1"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pengguna.warna}`}>
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm font-semibold text-gray-800">{pengguna.nama}</p>
              <p className="text-xs text-gray-500">{pengguna.jabatan}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition ${bukaAkun ? "rotate-180" : ""}`}
            />
          </button>

          {bukaAkun && (
            <div className="absolute right-0 top-full mt-3 w-72 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${pengguna.warna}`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{pengguna.nama}</p>
                  <p className="text-xs text-gray-500">{pengguna.jabatan}</p>
                </div>
              </div>

              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ganti Akun
              </p>
              <ul className="pb-2 max-h-60 overflow-y-auto">
                {semuaAkun.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => pilihAkun(a.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-green-50 ${
                        a.id === pengguna.id ? "bg-green-50/60" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${infoPeran[a.peran].warna}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-sm font-medium text-gray-800 truncate">{infoPeran[a.peran].label}</p>
                        <p className="text-xs text-gray-500 truncate">{a.nama}</p>
                      </div>
                      {a.id === pengguna.id && (
                        <Check className="w-4 h-4 text-hijau shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={keluar}
                className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-100 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
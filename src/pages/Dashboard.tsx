import { Users, GraduationCap, Mail, Send, Folder, Archive, Calendar } from "lucide-react";
import StatCard from "../components/StatCard";
import ActivityChart from "../components/ActivityChart";
import RecentDocuments from "../components/RecentDocuments";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import { usePengguna } from "../userStore";

export default function Dashboard() {
  const pengguna = usePengguna();
  const sekarang = new Date();
  const tanggal = sekarang.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const jam = sekarang
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    .replace(".", ":");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-hijau">Dashboard</h1>
          <p className="mt-2 text-gray-700">Selamat datang, {pengguna.nama} 👋</p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3 self-start">
          <Calendar className="w-6 h-6 text-gray-600" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">{tanggal}</p>
            <p className="text-sm text-gray-500">{jam} WIB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Siswa" value="128" unit="siswa" growth="12%"
          bg="bg-green-50/60" iconStyle="bg-green-100 text-green-600" valueColor="text-green-700" />
        <StatCard icon={GraduationCap} label="Total Guru" value="12" unit="guru" growth="8%"
          bg="bg-blue-50/60" iconStyle="bg-blue-100 text-blue-600" valueColor="text-blue-700" />
        <StatCard icon={Mail} label="Surat Masuk" value="45" unit="dokumen" growth="15%"
          bg="bg-emerald-50/60" iconStyle="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
        <StatCard icon={Send} label="Surat Keluar" value="38" unit="dokumen" growth="15%"
          bg="bg-orange-50/60" iconStyle="bg-orange-100 text-orange-500" valueColor="text-orange-500" />
        <StatCard icon={Folder} label="Dokumen Arsip" value="40" unit="dokumen" growth="10%"
          bg="bg-purple-50/60" iconStyle="bg-purple-100 text-purple-600" valueColor="text-purple-600" />
        <StatCard icon={Archive} label="Ukuran Penyimpanan" value="2.48 GB" unit="terpakai" growth="6%"
          bg="bg-teal-50/60" iconStyle="bg-teal-100 text-teal-600" valueColor="text-teal-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          <RecentDocuments />
        </div>
        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
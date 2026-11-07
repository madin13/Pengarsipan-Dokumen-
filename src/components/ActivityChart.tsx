import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";

const data = [
  { bulan: "Jan 2025", masuk: 18, keluar: 12, arsip: 8 },
  { bulan: "Feb 2025", masuk: 26, keluar: 16, arsip: 14 },
  { bulan: "Mar 2025", masuk: 32, keluar: 22, arsip: 18 },
  { bulan: "Apr 2025", masuk: 41, keluar: 29, arsip: 25 },
  { bulan: "Mei 2025", masuk: 45, keluar: 38, arsip: 29 },
];

export default function ActivityChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-hijau">Grafik Aktivitas Arsip</h3>
        <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 outline-none">
          <option>5 Bulan Terakhir</option>
          <option>3 Bulan Terakhir</option>
          <option>1 Tahun</option>
        </select>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend verticalAlign="top" iconType="line" />

            <Area type="monotone" dataKey="masuk" name="Surat Masuk"
              stroke="#3f8a2f" fill="#3f8a2f" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="keluar" name="Surat Keluar"
              stroke="#f39c1f" fill="#f39c1f" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="arsip" name="Dokumen Diarsipkan"
              stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
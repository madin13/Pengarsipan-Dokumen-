import { ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  growth: string;
  bg: string;
  iconStyle: string;
  valueColor: string;
};

export default function StatCard({
  icon: Icon, label, value, unit, growth, bg, iconStyle, valueColor,
}: Props) {
  return (
    <div className={`rounded-xl border border-gray-100 p-4 ${bg}`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-700">{label}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          <p className="text-sm text-gray-700">{unit}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500 flex items-center gap-1">
        <ArrowUp className="w-3.5 h-3.5 text-green-600" />
        <span className="text-green-600 font-semibold">{growth}</span>
        dari bulan lalu
      </p>
    </div>
  );
}
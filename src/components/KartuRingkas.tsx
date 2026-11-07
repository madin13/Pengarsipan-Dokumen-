import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  bg: string;
  iconStyle: string;
  valueColor: string;
  kecil?: boolean; // versi kecil untuk halaman cetak
};

export default function KartuRingkas({
  icon: Icon, label, value, unit, bg, iconStyle, valueColor, kecil,
}: Props) {
  return (
    <div className={`rounded-lg border border-gray-200 ${kecil ? "p-2" : "p-4"} ${bg}`}>
      <div className="flex items-center gap-2">
        <div className={`${kecil ? "w-8 h-8" : "w-12 h-12"} rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
          <Icon className={kecil ? "w-4 h-4" : "w-6 h-6"} />
        </div>
        <div className="leading-tight">
          <p className={`${kecil ? "text-[10px]" : "text-sm"} text-gray-700`}>{label}</p>
          <p className={`${kecil ? "text-base" : "text-2xl"} font-bold ${valueColor}`}>{value}</p>
          <p className={`${kecil ? "text-[10px]" : "text-sm"} text-gray-700`}>{unit}</p>
        </div>
      </div>
    </div>
  );
}
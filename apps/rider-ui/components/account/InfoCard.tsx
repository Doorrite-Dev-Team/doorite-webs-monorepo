import { ChevronRightIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | React.ReactNode;
  color?: string;
}

export default function InfoCard({ icon, label, value, color }: InfoCardProps) {
  return (
    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400">{label}</span>
          <div className="font-bold">{value}</div>
        </div>
      </div>
      <span className="material-symbols-outlined text-gray-400">
        <ChevronRightIcon />
      </span>
    </div>
  );
}

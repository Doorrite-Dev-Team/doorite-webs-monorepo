"use client";

import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

type TaskCardProps = {
  title: string;
  subtitle?: string;
  status?: string;
  progress?: number; // 0 - 100
  disabled?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ title, subtitle, status, progress = 0, disabled }) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div
      className={`bg-white dark:bg-surface-dark p-4 rounded-xl shadow-card border border-gray-100 dark:border-white/5 flex flex-col gap-3 relative overflow-hidden ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-400">
            {status === "In Progress" ? "package_2" : "local_shipping"}
          </span>
          <h3 className="font-bold">{title}</h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: status === "In Progress" ? "#FFFBEB" : "#F3F4F6", color: status === "In Progress" ? "#92400e" : "#6B7280" }}>
            {status}
          </span>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-sm text-primary hover:underline"
            aria-expanded={open}
            aria-label={open ? "Collapse task" : "Expand task"}
          >
            {open ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full`}
          style={{
            width: `${Math.max(0, Math.min(100, progress))}%`,
            background: disabled ? "rgba(156,163,175,0.6)" : undefined,
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">{subtitle}</span>

        <div className="flex items-center gap-2">
          <button className="cursor-pointer text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            Navigate
            {/* <span className="material-symbols-outlined text-[14px]">arrow_forward</span> */}
            <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Collapsible details */}
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-2" : "max-h-0"}`}
      >
        {/* Example expanded content */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-2">Pickup: McDonald's • 12 Adeola St, Victoria Island</p>
          <p className="mb-2">Notes: Ask for Order #2931 at the counter.</p>
          <div className="flex items-center gap-2 mt-2">
            <button className="px-3 py-2 bg-primary text-white rounded-full text-sm">Call Vendor</button>
            <button className="px-3 py-2 bg-white border rounded-full text-sm">Mark as picked</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

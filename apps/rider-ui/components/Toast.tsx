"use client";

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

interface ToastProps {
  message: string;
  subtext?: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

function Toast({
  message,
  subtext,
  type = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const borderColor =
    type === "error"
      ? "border-red-500"
      : type === "info"
      ? "border-blue-500"
      : "border-green-500";

  const iconColor =
    type === "error"
      ? "text-red-500"
      : type === "info"
      ? "text-blue-500"
      : "text-green-600";

  return (
    <div
      className={`fixed top-6 right-4 z-[9999] w-full max-w-sm bg-white border-l-4 ${borderColor} shadow-lg rounded-md p-4 flex items-start space-x-3 animate-slide-in`}
    >
      <div className={`mt-1 ${iconColor}`}></div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-neutral-900">{message}</p>
        {subtext && <p className="text-sm text-neutral-600 mt-1">{subtext}</p>}
      </div>
      <button
        onClick={onClose}
        type="button"
        className="text-neutral-400 hover:text-neutral-700"
      >
        ✕
      </button>

      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * ✅ Updated `showToast` — accepts an object instead of positional args
 */
export function showToast({
  message,
  subtext,
  type = "success",
  duration = 4000,
}: {
  message: string;
  subtext?: string;
  type?: "success" | "error" | "info";
  duration?: number;
}) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const removeToast = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <Toast
      message={message}
      subtext={subtext}
      type={type}
      duration={duration}
      onClose={removeToast}
    />
  );
}

export default Toast;

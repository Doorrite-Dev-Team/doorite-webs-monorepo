import React from "react";
import { CameraIcon, StarIcon } from "lucide-react";

export default function ProfileAvatar() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full p-1 border-2 border-primary bg-white dark:bg-surface-dark">
          <img
            alt="rider-profile"
            className="w-full h-full rounded-full object-cover"
            src="/assets/images/profile.png"
          />
        </div>

        <button className="absolute cursor-pointer bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
          <CameraIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="font-bold text-xl">Abdul Majeed</h2>
        <p className="text-sm text-gray-500">ID: DR7890</p>

        <div className="flex items-center gap-1 mt-2 bg-yellow-50 px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined fill-1 text-yellow-500 text-sm">
            <StarIcon className="w-4 h-4" />
          </span>
          <span className="text-sm font-bold text-yellow-700">4.8</span>
        </div>
      </div>
    </div>
  );
}

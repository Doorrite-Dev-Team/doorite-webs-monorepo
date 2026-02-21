import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <button className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 font-bold flex justify-center gap-2">
      <LogOutIcon />
      Log Out
    </button>
  );
}

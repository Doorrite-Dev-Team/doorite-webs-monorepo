import InfoCard from "@/components/account/InfoCard";
import { 
  LockKeyholeIcon,
  SettingsIcon,
  ShieldCheck
} from 'lucide-react'


export function AccountSettings() {
  return (
    <section>
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
        Account Settings
      </h3>

      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-card overflow-hidden">
        <InfoCard
          icon={<LockKeyholeIcon className="h-4 w-5"/>}
          label="Change Password"
          value=""
          // trailing={<span className="material-symbols-outlined">chevron_right</span>}
        />

        <div className="p-4 flex items-center justify-between">
          <span className="font-bold">Notification Preferences</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>

        <InfoCard
          icon={<SettingsIcon className="h-4 w-5"/>}
          label="App Settings"
          value=""
          // trailing={<span className="material-symbols-outlined">chevron_right</span>}
        />

        <InfoCard
          icon={<ShieldCheck className="h-4 w-5"/>}
          label="Privacy Settings"
          value=""
          // trailing={<span className="material-symbols-outlined">chevron_right</span>}
        />
      </div>
    </section>
  );
}

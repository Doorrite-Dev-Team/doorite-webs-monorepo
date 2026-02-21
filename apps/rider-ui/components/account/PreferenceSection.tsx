import InfoCard from "@/components/account/InfoCard";
import {
  BikeIcon,
  MailIcon,
  PhoneIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  FolderCheckIcon,
  MapMinusIcon
} from "lucide-react";

export default function PreferenceSection() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Personal Information
        </h3>

        <div className="bg-white dark:bg-surface-dark rounded-xl shadow border overflow-hidden">
          <InfoCard
            icon={<BikeIcon className="h-4 w-5"/>}
            label="Vehicle Type"
            value="Motorcycle (Bajaj)"
            color="bg-blue-50 text-blue-600"
          />
          <InfoCard
            icon={<PhoneIcon className="h-4 w-5"/>}
            label="Phone Number"
            value="+234 801 234 5678"
            color="bg-green-50 text-green-600"
          />
          <InfoCard
            icon={<MailIcon className="h-4 w-5"/>}
            label="Email Address"
            value="abdul.majeed@email.com"
            color="bg-purple-50 text-purple-600"
          />
        </div>
      </div>
    </section>
  );
}

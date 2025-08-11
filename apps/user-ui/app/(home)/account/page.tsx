import { profileCustomer } from "@repo/ui/assets";
import { Bell, CircleQuestionMark, CreditCard, Globe, Lock, MapPin, Moon, Phone, PlusIcon, User } from "lucide-react";
import Image from "next/image";

const AccountPage = () => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4 w-full flex flex-col items-center justify-center">
        <Image src={profileCustomer} alt="Profile" width={100} height={100} />
        <div className="text-center">
          <p className="text-lg font-semibold">Oliva Carter</p>
          <p>olivar.carter@gmail.com</p>
        </div>
      </div>
      <div className="space-y-8 w-full">
        <div className="space-y-4 w-full">
          <p className="font-semibold text-lg">Payment Options</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <CreditCard size={20} />
              </div>
              <p className="text-lg">Card Information</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <CreditCard size={20} />
              </div>
              <p className="text-lg">Mobile Payment</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <PlusIcon size={20} />
              </div>
              <p className="text-lg">Mobile Payment</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 w-full">
          <p className="font-semibold text-lg">App Settings</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Bell size={20} />
              </div>
              <p className="text-lg">Notifications</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Globe size={20} />
              </div>
              <p className="text-lg">Language</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Moon size={20} />
              </div>
              <p className="text-lg">Theme</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 w-full">
          <p className="font-semibold text-lg">Account Settings</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <User size={20} />
              </div>
              <p className="text-lg">Update Information</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Lock size={20} />
              </div>
              <p className="text-lg">Change Password</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <MapPin size={20} />
              </div>
              <p className="text-lg">Manage Address</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 w-full">
          <p className="font-semibold text-lg">Support</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <CircleQuestionMark size={20} />
              </div>
              <p className="text-lg">FAQ</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Phone size={20} />
              </div>
              <p className="text-lg">Contact Us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
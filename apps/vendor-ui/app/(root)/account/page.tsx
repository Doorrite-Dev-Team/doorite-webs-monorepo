import Account from "@/components/account/Account";
import { Metadata } from "next";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Account />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Account Settings | Your Business",
  description: "Manage your vendor account and preferences",
};

import Account from "@/components/account/Account";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return <Account />;
}

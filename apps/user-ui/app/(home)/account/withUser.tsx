"use client";
// import { AppSettingsSection } from "@/components/account/settings";
import AccountActionsSection from "@/components/account/account-action";
// import PaymentSection from "@/components/account/payment";
import SupportSection from "@/components/account/support";
import { AccountSettingsSection } from "@/components/account/account-setting";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";

const WithUser = () => {
  const [user] = useAtom(userAtom);

  if (user) {
    return (
      <div className="w-full overflow-hidden">
        {/*<PaymentSection />*/}

        {/*<AppSettingsSection />*/}

        <AccountSettingsSection />

        <SupportSection />

        <AccountActionsSection />
      </div>
    );
  }
  return null;
};

export default WithUser;

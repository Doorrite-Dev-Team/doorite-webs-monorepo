import ProfileSection from "@/components/account/profile";
import WithUser from "./withUser";

// Main Account Page Component
const AccountPage = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <ProfileSection />

      <WithUser />
    </div>
  );
};

export default AccountPage;

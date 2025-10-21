import ProfileSection from "./ProfileSection";
import BalanceCard from "./BalanceCard";

const PageHeader = ({ profile, balance }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start gap-8">
        <ProfileSection profile={profile} />
        <BalanceCard balance={balance} />
      </div>
    </div>
  );
};

export default PageHeader;

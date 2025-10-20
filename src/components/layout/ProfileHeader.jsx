const ProfileHeader = ({ profile, balance, showBalance = false }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <img
            src={profile?.profile_image || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h2 className="text-2xl font-semibold">
              {profile?.first_name} {profile?.last_name}
            </h2>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary to-red-400 text-white rounded-lg p-6 w-96 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm mb-2">Saldo anda</p>
            <h3 className="text-3xl font-bold mb-2">
              {showBalance
                ? `Rp ${balance?.toLocaleString("id-ID") || 0}`
                : "Rp •••••••"}
            </h3>
            <button className="text-xs underline">
              {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -right-4 bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

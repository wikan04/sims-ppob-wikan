import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/profile/profileSlice";
import {
  getBalance,
  getBanners,
  getServices,
} from "../features/transaction/transactionSlice";
import {
  formatCurrency,
  getProfileImage,
  getAvatarWithFallback,
} from "../utils/helpers";
import Loading from "../components/common/Loading";
import { Eye, EyeOff } from "lucide-react";

const Home = () => {
  const [showBalance, setShowBalance] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.profile);
  const { balance, banners, services, isLoading } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(getBanners());
    dispatch(getServices());
  }, [dispatch]);

  const handleServiceClick = (serviceCode) => {
    navigate(`/payment/${serviceCode}`);
  };

  if (isLoading && !profile) {
    return <Loading />;
  }

  const avatarProps = getAvatarWithFallback(getProfileImage(profile));

  return (
    <div className="min-h-screen bg-white">
      {/* Profile & Balance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start gap-8">
          {/* Profile Section */}
          <div className="flex flex-col items-start space-y-0">
            <img
              {...avatarProps}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mb-4"
            />
            <p className="text-lg">Selamat datang,</p>
            <h2 className="text-3xl font-semibold">
              {profile?.first_name} {profile?.last_name}
            </h2>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-primary to-red-400 text-white rounded-lg p-6 w-[500px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm mb-2">Saldo anda</p>
              <h3 className="text-4xl font-bold mb-3">
                {showBalance ? formatCurrency(balance) : "Rp •••••••"}
              </h3>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-xs font-medium flex items-center gap-1"
              >
                {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
                {showBalance ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -right-5 bottom-5 w-28 h-28 bg-white opacity-10 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {services.map((service) => (
            <button
              key={service.service_code}
              onClick={() => handleServiceClick(service.service_code)}
              className="flex flex-col items-center justify-center space-y-2 hover:opacity-80 transition"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  {...getAvatarWithFallback(service.service_icon)}
                  alt={service.service_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-center font-medium text-gray-700">
                {service.service_name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Temukan promo menarik
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="min-w-[350px] h-[160px] rounded-lg overflow-hidden flex-shrink-0"
            >
              <img
                {...getAvatarWithFallback(banner.banner_image)}
                alt={banner.banner_name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

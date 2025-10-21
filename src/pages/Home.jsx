import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { getProfile } from "../features/profile/profileSlice";
import {
  getBalance,
  getBanners,
  getServices,
} from "../features/transaction/transactionSlice";
import { getAvatarWithFallback } from "../utils/helpers";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Home = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Profile & Balance Section */}
      <PageHeader profile={profile} balance={balance} />

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

      {/* Banner Carousel Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Temukan promo menarik
        </h3>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          loop={true}
          slidesPerView={"auto"}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="banner-swiper"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-auto rounded-lg overflow-hidden">
                <img
                  {...getAvatarWithFallback(banner.banner_image)}
                  alt={banner.banner_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;

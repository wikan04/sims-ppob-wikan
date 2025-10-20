import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile } from "../features/profile/profileSlice";
import {
  getBalance,
  getServices,
  createTransaction,
  reset,
} from "../features/transaction/transactionSlice";
import {
  formatCurrency,
  getProfileImage,
  getAvatarWithFallback,
} from "../utils/helpers";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import Modal from "../components/common/Modal";
import ErrorModal from "../components/common/ErrorModal";
import Loading from "../components/common/Loading";
import { Banknote, Eye, EyeOff } from "lucide-react";

const Payment = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const { serviceCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.profile);
  const { balance, services, isLoading, isError, isSuccess } = useSelector(
    (state) => state.transaction
  );

  const selectedService = services.find(
    (service) => service.service_code === serviceCode
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setShowConfirmModal(false);
      setModalType("failed");
      setShowResultModal(true);
      dispatch(reset());
    }

    if (isSuccess) {
      setShowConfirmModal(false);
      setModalType("success");
      setShowResultModal(true);
      dispatch(reset());
      dispatch(getBalance());
    }
  }, [isError, isSuccess, dispatch]);

  const handlePayment = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (balance < selectedService?.service_tariff) {
      setShowConfirmModal(false);
      setErrorMessage("Saldo tidak mencukupi untuk melakukan transaksi");
      setShowErrorModal(true);
      return;
    }

    dispatch(createTransaction(serviceCode));
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    navigate("/home");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  if (!profile || !selectedService) {
    return <Loading />;
  }

  const avatarProps = getAvatarWithFallback(getProfileImage(profile));
  const serviceIconProps = getAvatarWithFallback(selectedService.service_icon);

  return (
    <div className="min-h-screen bg-white">
      {/* Profile & Balance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start gap-8">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <img
              {...avatarProps}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-600">Selamat datang,</p>
              <h2 className="text-3xl font-semibold">
                {profile?.first_name} {profile?.last_name}
              </h2>
            </div>
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

      {/* Payment Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">PemBayaran</p>
          <div className="flex items-center gap-3">
            <img
              {...serviceIconProps}
              alt={selectedService.service_name}
              className="w-8 h-8 object-cover"
            />
            <h1 className="text-2xl font-bold">
              {selectedService.service_name}
            </h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              value={formatCurrency(selectedService.service_tariff).replace(
                "Rp ",
                ""
              )}
              disabled
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handlePayment}
          disabled={isLoading}
        >
          Bayar
        </Button>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
        amount={selectedService?.service_tariff}
        description={`Beli ${selectedService?.service_name} senilai`}
        isLoading={isLoading}
        confirmText="Ya, lanjutkan Bayar"
        icon={selectedService?.service_icon}
        iconType="image"
      />

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={handleCloseResultModal}
        type={modalType}
        amount={selectedService?.service_tariff}
        description={`Pembayaran ${selectedService?.service_name} sebesar`}
      />
    </div>
  );
};

export default Payment;

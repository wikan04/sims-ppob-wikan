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
import { formatCurrency, getAvatarWithFallback } from "../utils/helpers";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import Modal from "../components/common/Modal";
import ErrorModal from "../components/common/ErrorModal";
import Loading from "../components/common/Loading";
import { Banknote } from "lucide-react";

const Payment = () => {
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

  const serviceIconProps = getAvatarWithFallback(selectedService.service_icon);

  return (
    <div className="min-h-screen bg-white">
      {/* Profile & Balance Section */}
      <PageHeader profile={profile} balance={balance} />

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

      {/* Modals */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />
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

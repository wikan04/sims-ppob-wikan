import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/profile/profileSlice";
import {
  getBalance,
  topUp,
  reset,
} from "../features/transaction/transactionSlice";
import {
  formatCurrency,
  formatNumber,
  getProfileImage,
  getAvatarWithFallback,
  validateNumericInput,
} from "../utils/helpers";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import Modal from "../components/common/Modal";
import ErrorModal from "../components/common/ErrorModal";
import Loading from "../components/common/Loading";
import { Banknote, Eye, EyeOff } from "lucide-react";

const TopUp = () => {
  const [amount, setAmount] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [transactionAmount, setTransactionAmount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.profile);
  const { balance, isLoading, isError, isSuccess } = useSelector(
    (state) => state.transaction
  );

  const presetAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
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
      setAmount("");
      dispatch(reset());
      dispatch(getBalance());
    }
  }, [isError, isSuccess, dispatch]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");

    if (validateNumericInput(value)) {
      setAmount(numericValue);
    }
  };

  const handlePresetClick = (preset) => {
    setAmount(preset.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const topUpAmount = parseInt(amount);

    if (!amount || topUpAmount <= 0) {
      setErrorMessage("Nominal top up harus lebih dari 0");
      setShowErrorModal(true);
      return;
    }

    if (topUpAmount < 10000) {
      setErrorMessage("Nominal top up minimal Rp 10.000");
      setShowErrorModal(true);
      return;
    }

    if (topUpAmount > 1000000) {
      setErrorMessage("Nominal top up maksimal Rp 1.000.000");
      setShowErrorModal(true);
      return;
    }

    setTransactionAmount(topUpAmount);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    dispatch(topUp(transactionAmount));
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

  if (!profile) {
    return <Loading />;
  }

  const avatarProps = getAvatarWithFallback(getProfileImage(profile));

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

      {/* Top Up Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">Silahkan masukan</p>
          <h1 className="text-3xl font-bold">Nominal Top Up</h1>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={amount ? formatNumber(amount) : ""}
                  onChange={handleAmountChange}
                  placeholder="masukan nominal Top Up"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md outline-none focus:border-gray-400"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!amount || isLoading}
                className={
                  !amount || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Top Up
              </Button>
            </form>
          </div>

          {/* Right Column - Preset Amounts */}
          <div className="grid grid-cols-3 gap-4">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="py-2 px-2 border border-gray-300 rounded-md hover:border-gray-400 transition text-sm font-medium"
              >
                {formatCurrency(preset)}
              </button>
            ))}
          </div>
        </div>
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
        amount={transactionAmount}
        description="Anda yakin untuk Top Up sebesar"
        isLoading={isLoading}
        confirmText="Ya, lanjutkan Top Up"
      />

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={handleCloseResultModal}
        type={modalType}
        amount={transactionAmount}
        description="Top Up Saldo sebesar"
      />
    </div>
  );
};

export default TopUp;

import { formatCurrency, getAvatarWithFallback } from "../../utils/helpers";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  description,
  isLoading,
  confirmText = "Ya, lanjutkan Top Up",
  icon = null,
  iconType = "logo",
}) => {
  if (!isOpen) return null;

  const serviceIconProps = icon ? getAvatarWithFallback(icon) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {iconType === "image" && serviceIconProps ? (
            <div className="w-16 h-16">
              <img
                {...serviceIconProps}
                alt="Service"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <img
                src="/Logo.png"
                alt="Service"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <h3 className="text-2xl font-bold mb-6">{formatCurrency(amount)} ?</h3>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-primary border-none rounded-md font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-gray-600 border-none rounded-md font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

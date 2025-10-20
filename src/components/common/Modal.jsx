import { Check, X } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

const Modal = ({ isOpen, onClose, type = "success", amount, description }) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <h3 className="text-2xl font-bold mb-1">{formatCurrency(amount)}</h3>
        <p className="text-sm text-gray-600 mb-6">
          {isSuccess ? "berhasil!" : "gagal!"}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="text-primary font-semibold text-sm hover:underline"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default Modal;

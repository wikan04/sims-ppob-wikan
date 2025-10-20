import { AlertCircle } from "lucide-react";

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Error Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-red-600 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;

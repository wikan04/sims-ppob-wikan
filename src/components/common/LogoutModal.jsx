import { LogOut } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-xl font-bold mb-2">Logout</h3>
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin keluar dari akun ini?
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Ya, Logout"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-gray-600 border border-gray-300 rounded-md font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

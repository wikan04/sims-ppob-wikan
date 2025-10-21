import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

const BalanceCard = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
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
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      <div className="absolute -right-5 bottom-5 w-28 h-28 bg-white opacity-10 rounded-full"></div>
    </div>
  );
};

export default BalanceCard;

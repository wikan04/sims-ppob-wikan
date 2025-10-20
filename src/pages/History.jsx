import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../features/profile/profileSlice";
import {
  getBalance,
  getTransactionHistory,
  resetHistory,
  reset,
} from "../features/transaction/transactionSlice";
import {
  formatCurrency,
  formatDate,
  getProfileImage,
  getAvatarWithFallback,
  getAllMonths,
  getTransactionMonth,
  getTransactionColor,
  getTransactionSign,
} from "../utils/helpers";
import Loading from "../components/common/Loading";
import { Eye, EyeOff } from "lucide-react";

const History = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const { balance, history, isLoading } = useSelector(
    (state) => state.transaction
  );

  const allMonths = getAllMonths();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(resetHistory());
    dispatch(getTransactionHistory({ offset: 0, limit: null }));

    return () => {
      dispatch(resetHistory());
      dispatch(reset());
    };
  }, [dispatch]);

  const handleMonthFilter = (month) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(month);
    }
  };

  const monthsWithTransactions = useMemo(() => {
    const monthsSet = new Set();

    history.records.forEach((transaction) => {
      const monthIndex = getTransactionMonth(transaction.created_on);
      const monthName = allMonths[monthIndex];
      monthsSet.add(monthName);
    });

    return monthsSet;
  }, [history.records, allMonths]);

  const hasTransactionsInSelectedMonth = selectedMonth
    ? monthsWithTransactions.has(selectedMonth)
    : true;

  const filteredTransactions = useMemo(() => {
    if (!selectedMonth) return history.records;

    const selectedMonthIndex = allMonths.indexOf(selectedMonth);
    return history.records.filter(
      (transaction) =>
        getTransactionMonth(transaction.created_on) === selectedMonthIndex
    );
  }, [selectedMonth, history.records, allMonths]);

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

      {/* Transaction History Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-xl font-semibold mb-6">Semua Transaksi</h3>

        {/* Month Filter - Show all 12 months */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {allMonths.map((month) => {
            const hasTransactions = monthsWithTransactions.has(month);
            return (
              <button
                key={month}
                onClick={() => handleMonthFilter(month)}
                className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition ${
                  selectedMonth === month
                    ? "bg-gray-900 text-white"
                    : hasTransactions
                    ? "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                    : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>
              {selectedMonth && !hasTransactionsInSelectedMonth
                ? `Maaf tidak ada histori transaksi pada bulan ${selectedMonth}`
                : selectedMonth
                ? `Maaf tidak ada histori transaksi pada bulan ${selectedMonth}`
                : "Maaf tidak ada histori transaksi saat ini"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => {
              const transactionColor = getTransactionColor(
                transaction.transaction_type
              );
              const transactionSign = getTransactionSign(
                transaction.transaction_type
              );

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xl font-bold ${transactionColor}`}>
                        {transactionSign}
                      </span>
                      <span className={`text-xl font-bold ${transactionColor}`}>
                        {formatCurrency(transaction.total_amount)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_on)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {transaction.description || transaction.transaction_type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

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
  getAllMonths,
  getTransactionMonth,
  getTransactionColor,
  getTransactionSign,
} from "../utils/helpers";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

const History = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Profile & Balance Section */}
      <PageHeader profile={profile} balance={balance} />

      {/* Transaction History Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-semibold mb-6">Semua Transaksi</h3>

        {/* Month Filter */}
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
                    ? "bg-white text-gray-600 !font-bold hover:bg-gray-100 "
                    : "bg-white text-gray-400 hover:bg-gray-50 "
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

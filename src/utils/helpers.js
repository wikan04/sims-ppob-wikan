// Format number ke Rupiah
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "Rp 0";
  return `Rp ${parseInt(amount).toLocaleString("id-ID")}`;
};

// Format date ke Indonesia
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
};

// Format number dengan thousand separator (titik)
export const formatNumber = (num) => {
  if (!num) return "";
  return parseInt(num).toLocaleString("id-ID");
};

// Parse formatted number ke raw number
export const parseFormattedNumber = (str) => {
  if (!str) return 0;
  return parseInt(str.replace(/\D/g, ""));
};

// Get profile image or default/generated
export const getProfileImage = (profile) => {
  // Check if profile_image exists and not null URL
  if (
    profile?.profile_image &&
    profile.profile_image !==
      "https://minio.nutech-integrasi.com/take-home-test/null"
  ) {
    return profile.profile_image;
  }

  // Return default avatar
  return "/default-avatar.png";
};

// Get avatar with fallback
export const getAvatarWithFallback = (imageUrl) => {
  return {
    src: imageUrl || "/default-avatar.png",
    onError: (e) => {
      e.target.onerror = null;
      e.target.src = "/default-avatar.png";
    },
  };
};

// Format transaction type
export const formatTransactionType = (type) => {
  const types = {
    TOPUP: "Top Up Saldo",
    PAYMENT: "Pembayaran",
  };
  return types[type] || type;
};

// Get transaction color class
export const getTransactionColor = (type) => {
  return type === "TOPUP" ? "text-green-500" : "text-red-500";
};

// Get transaction sign
export const getTransactionSign = (type) => {
  return type === "TOPUP" ? "+" : "-";
};

// Validate input only numbers
export const validateNumericInput = (value) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue === "" || /^\d+$/.test(numericValue);
};

// Get month name by index
export const getMonthName = (index) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[index];
};

// Get all month names
export const getAllMonths = () => {
  return [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
};

// Get transaction month
export const getTransactionMonth = (dateString) => {
  const date = new Date(dateString);
  return date.getMonth();
};

// Check if month has transactions
export const checkMonthHasTransactions = (transactions, monthName) => {
  const monthIndex = getAllMonths().indexOf(monthName);
  return transactions.some(
    (transaction) => getTransactionMonth(transaction.created_on) === monthIndex
  );
};

import api from "../../services/api";

const getBalance = async () => {
  const response = await api.get("/balance");
  return response.data.data;
};

const getBanners = async () => {
  const response = await api.get("/banner");
  return response.data.data;
};

const getServices = async () => {
  const response = await api.get("/services");
  return response.data.data;
};

const topUp = async (amount) => {
  const response = await api.post("/topup", { top_up_amount: amount });
  return response.data.data;
};

const createTransaction = async (serviceCode) => {
  const response = await api.post("/transaction", {
    service_code: serviceCode,
  });
  return response.data.data;
};

const getTransactionHistory = async (offset = 0, limit = null) => {
  const params = { offset };
  if (limit) params.limit = limit;

  const response = await api.get("/transaction/history", { params });
  return response.data.data;
};

const transactionService = {
  getBalance,
  getBanners,
  getServices,
  topUp,
  createTransaction,
  getTransactionHistory,
};

export default transactionService;

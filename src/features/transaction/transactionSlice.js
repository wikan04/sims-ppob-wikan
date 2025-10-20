import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "./transactionService";

const initialState = {
  balance: 0,
  banners: [],
  services: [],
  history: {
    records: [],
    offset: 0,
    limit: null,
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Get Balance
export const getBalance = createAsyncThunk(
  "transaction/getBalance",
  async (_, thunkAPI) => {
    try {
      return await transactionService.getBalance();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Banners
export const getBanners = createAsyncThunk(
  "transaction/getBanners",
  async (_, thunkAPI) => {
    try {
      return await transactionService.getBanners();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Services
export const getServices = createAsyncThunk(
  "transaction/getServices",
  async (_, thunkAPI) => {
    try {
      return await transactionService.getServices();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Top Up
export const topUp = createAsyncThunk(
  "transaction/topUp",
  async (amount, thunkAPI) => {
    try {
      return await transactionService.topUp(amount);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Transaction
export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async (serviceCode, thunkAPI) => {
    try {
      return await transactionService.createTransaction(serviceCode);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Transaction History
export const getTransactionHistory = createAsyncThunk(
  "transaction/getTransactionHistory",
  async ({ offset, limit }, thunkAPI) => {
    try {
      return await transactionService.getTransactionHistory(offset, limit);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetHistory: (state) => {
      state.history = {
        records: [],
        offset: 0,
        limit: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Balance
      .addCase(getBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Banners
      .addCase(getBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
      })
      // Get Services
      .addCase(getServices.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      // Top Up
      .addCase(topUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.balance;
        state.message = "Top Up berhasil";
      })
      .addCase(topUp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Transaksi berhasil";
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Transaction History
      .addCase(getTransactionHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history.records = [
          ...state.history.records,
          ...action.payload.records,
        ];
        state.history.offset = action.payload.offset;
        state.history.limit = action.payload.limit;
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetHistory } = transactionSlice.actions;
export default transactionSlice.reducer;

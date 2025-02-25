import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { message } from "antd";
import PaymentService from "./PaymentService";


// Get all debit notes
export const getAllPayment = createAsyncThunk(
  "payment/getAllPayment",
  async (_, thunkAPI) => {
    try {
      const response = await PaymentService.GetAllPayment();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create debit note
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData, thunkAPI) => {
    try {
      const response = await PaymentService.CreatePayment(paymentData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payment: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all debit notes
      .addCase(getAllPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
      })
      .addCase(getAllPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message || "Failed to fetch payments");
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        message.success("Payment created successfully");
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = paymentSlice.actions;
export default paymentSlice.reducer;

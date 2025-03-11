import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./paymentService";
import { toast } from "react-toastify";

import { message } from "antd";



export const AddPay = createAsyncThunk(
  "users/AddPay",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await UserService.AddPyment(id, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const Getpay = createAsyncThunk("emp/Getpay", async (id, thunkAPI) => {
  try {
    const response = await UserService.GetPayment(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAllUsers();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getUserById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deletePay = createAsyncThunk(
  "users/deletePay",
  async (exid, thunkAPI) => {
    try {
      const response = await UserService.DeletePayment(exid);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditPay = createAsyncThunk(
  "users/EditPay",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await UserService.EditPayment(id, data);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Async thunk for updating a user



const paymentSlice = createSlice({
  name: "Payment",
  initialState: {
    Payment: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  reducers: {
    toggleAddModal: (state, action) => {
      state.addModel = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
      state.editItem = {};
    },
    editUserData: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
    },
    handleLogout: (state, action) => {
      state.isAuth = action.payload;
      state.loggedInUser = null;
      localStorage.removeItem("isAuth");
      localStorage.removeItem("USER");
      localStorage.removeItem("TOKEN");
    },
    toggleDetailModal: (state, action) => {
      state.detailItem = action.payload;
      state.detailModal = !state.editModal;
    },
    closeDetailModal: (state, action) => {
      state.detailModal = action.payload;
      state.detailItem = {};
    },
  },
  extraReducers: (builder) => {
    builder
      //add
      .addCase(AddPay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddPay.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddPay.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(Getpay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Getpay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Payment = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(Getpay.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deletePay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePay.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletePay.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(EditPay.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditPay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(EditPay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  paymentSlice.actions;
export default paymentSlice.reducer;

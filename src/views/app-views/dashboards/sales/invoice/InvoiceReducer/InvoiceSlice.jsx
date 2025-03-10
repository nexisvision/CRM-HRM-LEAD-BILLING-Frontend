import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./InvoiceService";
import { toast } from "react-toastify";
import { message } from "antd";
import { navigate } from "react-big-calendar/lib/utils/constants";

// Async thunk for adding user

export const AddInvoices = createAsyncThunk(
  "users/AddInvoices",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addinv(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getInvoice = createAsyncThunk(
  "emp/getInvoice",
  async (thunkAPI) => {
    try {
      const response = await UserService.getinv();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async thunk for deleting a user
export const deleteInvoice = createAsyncThunk(
  "users/deleteInvoiceeet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteinv(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editInvoice = createAsyncThunk(
  "users/editInvoice",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.editinv(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

const initialUser = () => {
  const item = window.localStorage.getItem("USER");
  return item ? JSON.parse(item) : null;
};

const initialIsAuth = () => {
  const item = window.localStorage.getItem("isAuth");
  return item ? JSON.parse(item) : false;
};

const RoleAndPermissionSlice = createSlice({
  name: "salesInvoices",
  initialState: {
    salesInvoices: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
    error: null,
    success: false
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
      .addCase(AddInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data) {
          state.salesInvoices = state.salesInvoices || [];
        }
        state.success = true;
        message.success(action.payload?.message);
      })
      .addCase(AddInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      })

      .addCase(getInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesInvoices = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      })

      //delete
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editInvoice.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(editInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

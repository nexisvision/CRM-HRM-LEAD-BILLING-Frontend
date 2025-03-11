import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./CustomerService";
import { toast } from "react-toastify";
import { message } from "antd";

export const addcus = createAsyncThunk(
  "users/addcus",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.creatrecustomers(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const Getcus = createAsyncThunk(
  "emp/Getcus",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.getcustomers(loginData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const delcus = createAsyncThunk(
  "users/delcuseet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletecustomers(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editcus = createAsyncThunk(
  "users/editcus",
  async ({ idd, payload }, thunkAPI) => {
    try {
      const response = await UserService.editcustomers(idd, payload);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const RoleAndPermissionSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
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
      .addCase(addcus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addcus.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(addcus.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(Getcus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Getcus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(Getcus.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(delcus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delcus.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload.message);
      })
      .addCase(delcus.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(editcus.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editcus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
      })
      .addCase(editcus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

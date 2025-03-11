import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AccountService from "./AccountService";
import toast from "react-hot-toast";
import { message } from "antd";


export const addAccount = createAsyncThunk(
  "users/addAccount",
  async (userData, thunkAPI) => {
    try {
      const response = await AccountService.createAccount(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getAccounts = createAsyncThunk(
  "emp/getAccounts",
  async (thunkAPI) => {
    try {
      const response = await AccountService.getAccounts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getAllAccounts = createAsyncThunk(
  "users/getAllAccounts",
  async (thunkAPI) => {
    try {
      const response = await AccountService.getAllAccounts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);





export const deleteAccount = createAsyncThunk(
  "users/deleteAccount",
  async (userId, thunkAPI) => {
    try {
      const response = await AccountService.deleteAccount(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editAccount = createAsyncThunk(
  "users/editAccount",
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await AccountService.updateAccount(id, payload);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

const AccountSlice = createSlice({
  name: "account",
  initialState: {
    account: [],
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
      .addCase(addAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        // toast.success(action.payload?.data?.message);
        message.success(action.payload?.message);
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.isLoading = false;
        // toast.error(action.payload?.message);
        message.error(action.payload?.message);
      })

      .addCase(getAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.account = action?.payload;
        // toast.success(action.payload?.data?.message);
        // message.success(action.payload?.data?.message);
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.isLoading = false;
        // toast.error(action.payload?.message);
        message.error(action.payload?.message);
      })

      //getall
      .addCase(getAllAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.account = action.payload;
        toast.success(`Accounts fetched successfully`);
      })
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getuserbyid
      //delete
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        // toast.success(action.payload.message);
        message.success(action.payload?.message);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        // toast.error(action.payload?.response?.data?.message);
        message.error(action.payload?.message);
      })
      //update
      .addCase(editAccount.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message); // Update the state with the updated employee data
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  AccountSlice.actions;
export default AccountSlice.reducer;
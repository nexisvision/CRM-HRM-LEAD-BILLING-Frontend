import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./transferService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

export const addaccountsss = createAsyncThunk(
  "users/addaccountsss",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addaccounts(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const transferdatas = createAsyncThunk(
  "emp/transferdatas",
  async (thunkAPI) => {
    try {
      const response = await UserService.transferdata();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

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

export const transferdeltess = createAsyncThunk(
  "users/transferdeltess",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.transferdelte(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const eidttransfer = createAsyncThunk(
  "users/eidttransfer",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.edittransfer(idd, values);
      return response;
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

const ContractSlice = createSlice({
  name: "transfer",
  initialState: {
    transfer: [],
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
      .addCase(addaccountsss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addaccountsss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(addaccountsss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(transferdatas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(transferdatas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transfer = action?.payload;
        // message.success(action.payload?.message);
      })

      .addCase(transferdatas.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      //delete
      .addCase(transferdeltess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(transferdeltess.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(transferdeltess.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(eidttransfer.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(eidttransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
      })

      .addCase(eidttransfer.rejected, (state, action) => {
        state.isLoading = false;
      });

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
ContractSlice.actions;
export default ContractSlice.reducer;

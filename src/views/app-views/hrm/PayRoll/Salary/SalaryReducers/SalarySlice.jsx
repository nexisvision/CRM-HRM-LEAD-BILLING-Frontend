import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./SalaryService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user

export const AddSalaryss = createAsyncThunk(
  "users/AddSalaryss",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addsal(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const getSalaryss = createAsyncThunk(
  "emp/getSalaryss",
  async (thunkAPI) => {
    try {
      const response = await UserService.getsal();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all users
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

// Async thunk for getting user by id
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

// Async thunk for deleting a user
export const deleteSalaryss = createAsyncThunk(
  "users/deleteSalaryss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletsal(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editSalaryss = createAsyncThunk(
  "users/editSalaryss",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.editsal(idd, values);
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

const SalarySlice = createSlice({
  name: "salary",
  initialState: {
    salary: [],
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
      .addCase(AddSalaryss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getSalaryss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salary = action?.payload;
        toast.success(action.payload?.message);
      })
      .addCase(getSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //delete
      .addCase(deleteSalaryss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload.message);
      })

      .addCase(deleteSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.message);
      })
      //update

      .addCase(editSalaryss.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })

      .addCase(editSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  SalarySlice.actions;
export default SalarySlice.reducer;

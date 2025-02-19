import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./JobapplicationService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user

export const Addjobapplication = createAsyncThunk(
  "users/Addjobapplication",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addjobapp(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const getjobapplication = createAsyncThunk(
  "emp/getjobapplication",
  async (thunkAPI) => {
    try {
      const response = await UserService.getjobapp();
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
export const deletejobapplication = createAsyncThunk(
  "users/deletejobapplicationeet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletejobapp(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editjobapplication = createAsyncThunk(
  "users/editjobapplication",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.editjobapp(idd, formData);
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

const JobapplicationSlice = createSlice({
  name: "jobapplications",
  initialState: {
    jobapplications: [],
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
      .addCase(Addjobapplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Addjobapplication.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(Addjobapplication.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getjobapplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getjobapplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobapplications = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getjobapplication.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

     
      //delete
      .addCase(deletejobapplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletejobapplication.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletejobapplication.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(editjobapplication.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editjobapplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(editjobapplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  JobapplicationSlice.actions;
export default JobapplicationSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./jobonBoardinService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user

export const AddJobonBoarding = createAsyncThunk(
  "users/AddJobonBoarding",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addjobonb(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const getJobonBoarding = createAsyncThunk(
  "emp/getJobonBoarding",
  async (thunkAPI) => {
    try {
      const response = await UserService.getjobonb();
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

// Asyc thunk for deleting a user
export const deleteJobonBoarding = createAsyncThunk(
  "users/deleteJobonBoardingeet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletejobonb(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editJobonBoardingss = createAsyncThunk(
  "users/editJobonBoarding",
  async ({ idd, data }, thunkAPI) => {
    try {
      const response = await UserService.editjobonb(idd, data);
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

const jobonboardingSlice = createSlice({
  name: "jobonboarding",
  initialState: {
    jobonboarding: [],
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
      .addCase(AddJobonBoarding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddJobonBoarding.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddJobonBoarding.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getJobonBoarding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobonBoarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobonboarding = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getJobonBoarding.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

    
      .addCase(deleteJobonBoarding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteJobonBoarding.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deleteJobonBoarding.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(editJobonBoardingss.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editJobonBoardingss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(editJobonBoardingss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  jobonboardingSlice.actions;
export default jobonboardingSlice.reducer;

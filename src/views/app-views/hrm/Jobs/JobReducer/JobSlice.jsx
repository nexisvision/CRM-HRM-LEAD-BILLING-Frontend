import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./JobService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";


export const AddJobs = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.CreateJob(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const GetJobdata = createAsyncThunk(
  "emp/getmeet",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.Getjobs(loginData);
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

export const Deletejobs = createAsyncThunk(
  "users/Deletejobseet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteJob(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditJobs = createAsyncThunk(
  "users/EditJobs",
  async ({ idd, transformedValues }, thunkAPI) => {
    try {
      const response = await UserService.Editjobdata(idd, transformedValues);
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

const JobSlice = createSlice({
  name: "Jobs",
  initialState: {
    Jobs: [],
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
      .addCase(AddJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddJobs.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(AddJobs.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(GetJobdata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetJobdata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Jobs = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetJobdata.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

   
      .addCase(Deletejobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Deletejobs.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(Deletejobs.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(EditJobs.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; 
      })
      .addCase(EditJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  JobSlice.actions;
export default JobSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./jobofferlatterService";
import { toast } from "react-toastify";

export const Addjobofferss = createAsyncThunk(
  "users/Addjobofferss",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addoffer(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getjobofferss = createAsyncThunk(
  "emp/getjobofferss",
  async (thunkAPI) => {
    try {
      const response = await UserService.getoffer();
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


export const deletejobofferss = createAsyncThunk(
  "users/deletejobofferss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deldetoffer(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editjobofferss = createAsyncThunk(
  "users/editjobofferss",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.editoffer(idd, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const jobofferlateerSlice = createSlice({
  name: "joboffers",
  initialState: {
    joboffers: [],
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
      .addCase(Addjobofferss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Addjobofferss.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.data?.message);
      })
      .addCase(Addjobofferss.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })

      .addCase(getjobofferss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getjobofferss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.joboffers = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getjobofferss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(deletejobofferss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletejobofferss.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deletejobofferss.rejected, (state, action) => {
        state.isLoading = false;
      })
      //update
      .addCase(editjobofferss.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editjobofferss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        // message.success(action.payload?.message);
        // Update the state with the updated employee data
      })
      .addCase(editjobofferss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  jobofferlateerSlice.actions;
export default jobofferlateerSlice.reducer;

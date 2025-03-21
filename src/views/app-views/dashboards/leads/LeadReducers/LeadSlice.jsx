import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./LeadService";
import { toast } from "react-toastify";

import { message } from "antd";

export const LeadsAdd = createAsyncThunk(
  "users/LeadsAdd",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.AddLeads(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const GetLeads = createAsyncThunk("emp/GetLeads", async (thunkAPI) => {
  try {
    const response = await UserService.GetLeads();
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

export const LeadsDelete = createAsyncThunk(
  "users/LeadsDelete",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteLeads(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const LeadsEdit = createAsyncThunk(
  "users/LeadsEdit",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await UserService.EditLeads(id, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

const LeadSlice = createSlice({
  name: "Leads",
  initialState: {
    Leads: [],
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
      .addCase(LeadsAdd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LeadsAdd.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(LeadsAdd.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(GetLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Leads = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetLeads.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall

      //delete
      .addCase(LeadsDelete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LeadsDelete.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(LeadsDelete.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.data?.message);
      })

      //update
      .addCase(LeadsEdit.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(LeadsEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(LeadsEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  LeadSlice.actions;
export default LeadSlice.reducer;

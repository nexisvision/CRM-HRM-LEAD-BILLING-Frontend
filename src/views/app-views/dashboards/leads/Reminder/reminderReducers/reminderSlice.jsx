import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./reminderService";
import { toast } from "react-toastify";

import { message } from "antd";




export const adddreinderss = createAsyncThunk(
  "users/adddreinderss",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addreinderss(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getssreinderss = createAsyncThunk("emp/getssreinderss", async (thunkAPI) => {
  try {
    const response = await UserService.getreinderss();
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


export const deletessreinderss = createAsyncThunk(
  "users/deletessreinderss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletereinderss(userId);
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

// Async thunk for updating a user



const LeadSlice = createSlice({
  name: "Reminder",
  initialState: {
    Reminder: [],
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
      .addCase(adddreinderss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adddreinderss.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(adddreinderss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getssreinderss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getssreinderss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Reminder = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getssreinderss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall

      //delete
      .addCase(deletessreinderss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletessreinderss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletessreinderss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.data?.message);
      })

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

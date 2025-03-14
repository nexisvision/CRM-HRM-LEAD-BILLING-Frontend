import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./proposalService";
import { toast } from "react-toastify";
import { message } from "antd";



export const addpropos = createAsyncThunk(
  "users/addpropos",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addpropo(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getpropos = createAsyncThunk("emp/getpropos", async (thunkAPI) => {
  try {
    const response = await UserService.getpropo();
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


export const delpropos = createAsyncThunk(
  "users/delpropos",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.delpropo(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const edpropos = createAsyncThunk(
  "users/edpropos",
  async ({ id, proposalData }, thunkAPI) => {
    try {
      const response = await UserService.editpropo(id, proposalData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Async thunk for updating a user



const proposalSlice = createSlice({
  name: "proposal",
  initialState: {
    proposal: [],
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
      .addCase(addpropos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addpropos.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(addpropos.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getpropos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getpropos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proposal = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getpropos.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(delpropos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delpropos.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload.message);
      })
      .addCase(delpropos.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(edpropos.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(edpropos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(edpropos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  proposalSlice.actions;
export default proposalSlice.reducer;

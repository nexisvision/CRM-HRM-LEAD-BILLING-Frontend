import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./ContractService";
import { message } from "antd";

export const AddCon = createAsyncThunk(
  "users/AddCon",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.CreateCon(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const ContaractData = createAsyncThunk(
  "emp/ContaractData",
  async (thunkAPI) => {
    try {
      const response = await UserService.ContaractData();
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

export const DeleteCon = createAsyncThunk(
  "users/DeleteCon",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteCon(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editcon = createAsyncThunk(
  "users/Editcon",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.Editcon(id, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);




const ContractSlice = createSlice({
  name: "Contract",
  initialState: {
    Contract: [],
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
      .addCase(AddCon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddCon.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddCon.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(ContaractData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ContaractData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Contract = action?.payload;
        // message.success(action.payload?.message);
      })

      .addCase(ContaractData.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      //delete
      .addCase(DeleteCon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteCon.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(DeleteCon.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(Editcon.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editcon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })

      .addCase(Editcon.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      });

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  ContractSlice.actions;
export default ContractSlice.reducer;

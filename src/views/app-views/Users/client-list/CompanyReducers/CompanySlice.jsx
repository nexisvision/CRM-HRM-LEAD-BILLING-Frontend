import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./CompanyService";
import { toast } from "react-toastify";

export const addClient = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.createClient(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const ClientData = createAsyncThunk(
  "emp/getClient",
  async (thunkAPI) => {
    try {
      const response = await UserService.ClientData();
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


export const deleteClient = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteClient(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editclient = createAsyncThunk(
  "users/updateEmployee",
  async ({ comnyid, formData }, thunkAPI) => {
    try {
      const response = await UserService.EditClient(comnyid, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Async thunk for updating a user



const RoleAndPermissionSlice = createSlice({
  name: "SubClient",
  initialState: {
    SubClient: [],
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
      // Add Client
      .addCase(addClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false;
      })

      // Get Client Data
      .addCase(ClientData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SubClient = action?.payload;
      })
      .addCase(ClientData.rejected, (state, action) => {
        state.isLoading = false;
        toast.error("Failed to fetch client data");
      })

      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Client deleted successfully");
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        toast.error("Failed to delete client");
      })

      // Edit Client
      .addCase(Editclient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Editclient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
      })
      .addCase(Editclient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update client";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

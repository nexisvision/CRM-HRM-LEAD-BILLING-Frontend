import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./deducationService";
import { toast } from "react-toastify";

export const adddeducati = createAsyncThunk(
  "users/adddeducati",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.adddedu(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getdeducati = createAsyncThunk(
  "emp/getdeducati",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.gtededu(loginData);
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


export const deltededucati = createAsyncThunk(
  "users/deltededucati",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deldedu(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editdeducati = createAsyncThunk(
  "users/editdeducati",
  async ({ meetid, values }, thunkAPI) => {
    try {
      const response = await UserService.editdedu(meetid, values);
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
  name: "deducation",
  initialState: {
    deducation: [],
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
      .addCase(adddeducati.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adddeducati.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(adddeducati.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getdeducati.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getdeducati.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deducation = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getdeducati.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        toast.success(`Users fetched successfully`);
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      //getuserbyid
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.user;
        toast.success(action.payload.message);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deltededucati.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deltededucati.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deltededucati.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editdeducati.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editdeducati.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
      })
      .addCase(editdeducati.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

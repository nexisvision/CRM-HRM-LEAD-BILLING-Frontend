import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./subplanService";
import { toast } from "react-toastify";



export const Addpolicys = createAsyncThunk(
  "users/Addpolicys",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addpolicy(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getsubplandata = createAsyncThunk(
  "emp/getsubplandata",
  async (thunkAPI) => {
    try {
      const response = await UserService.getsubplan();
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


export const deletepolicys = createAsyncThunk(
  "users/deletepolicys",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletepolicy(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editpolicys = createAsyncThunk(
  "users/editpolicys",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.editpolicy(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const subplanSlice = createSlice({
  name: "subplan",
  initialState: {
    subplan: [],
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
      .addCase(Addpolicys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Addpolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(Addpolicys.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getsubplandata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsubplandata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subplan = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getsubplandata.rejected, (state, action) => {
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
      .addCase(deletepolicys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletepolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deletepolicys.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editpolicys.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editpolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
      })
      .addCase(editpolicys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  subplanSlice.actions;
export default subplanSlice.reducer;

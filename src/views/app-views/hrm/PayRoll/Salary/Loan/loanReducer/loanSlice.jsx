import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./loanService";
import { toast } from "react-toastify";



export const addloans = createAsyncThunk(
  "users/addloans",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addloan(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getloans = createAsyncThunk(
  "emp/getloans",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.getloan(loginData);
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


export const deleteloans = createAsyncThunk(
  "users/deleteloans",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteloan(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editloans = createAsyncThunk(
  "users/editloans",
  async ({ meetid, values }, thunkAPI) => {
    try {
      const response = await UserService.editloan(meetid, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);




const RoleAndPermissionSlice = createSlice({
  name: "loan",
  initialState: {
    loan: [],
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
      .addCase(addloans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addloans.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addloans.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getloans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getloans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loan = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getloans.rejected, (state, action) => {
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
      .addCase(deleteloans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteloans.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteloans.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editloans.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editloans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
      })
      .addCase(editloans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

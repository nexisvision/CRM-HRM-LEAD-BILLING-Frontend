import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./mailService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user

export const sendmailslice = createAsyncThunk(
  "users/sendmailslice",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.sendmail(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const getmailadatas = createAsyncThunk(
  "emp/getmailadatas",
  async (thunkAPI) => {
    try {
      const response = await UserService.getallmaildata();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all users
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

// Async thunk for getting user by id
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

// Async thunk for deleting a user
export const deleteBranch = createAsyncThunk(
  "users/deleteBrancheet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletebra(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editBranch = createAsyncThunk(
  "users/editBranch",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.editbra(idd, values);
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

const BranchSlice = createSlice({
  name: "mail",
  initialState: {
    mail: [],
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
      .addCase(sendmailslice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendmailslice.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })
      .addCase(sendmailslice.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })


      .addCase(getmailadatas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getmailadatas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mail = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getmailadatas.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })

      //update
      .addCase(editBranch.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
        // message.success(action.payload?.message);
      })

      .addCase(editBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // message.error(action.payload?.message);
      });

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  BranchSlice.actions;
export default BranchSlice.reducer;

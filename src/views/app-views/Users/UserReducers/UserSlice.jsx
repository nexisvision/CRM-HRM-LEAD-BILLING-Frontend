import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./UserService";
import { toast } from "react-toastify";
import axios from "axios";
import { message } from "antd";
import { env } from "configs/EnvironmentConfig";



export const AddUserss = createAsyncThunk(
  "users/addtu",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.Createuser(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const GetUsers = createAsyncThunk(
  "emp/getUsers", // action type
  async (loginData, thunkAPI) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.get(`${env.API_ENDPOINT_URL}/userss/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // This will be available in the reducer as `action.payload`
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
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


export const Dleteusetr = createAsyncThunk(
  "users/Dleteusetreet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteUser(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Edituser = createAsyncThunk(
  "users/Edituser",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.Editusers(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const UserSlice = createSlice({
  name: "Users",
  initialState: {
    Users: [],
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
      .addCase(AddUserss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddUserss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddUserss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(GetUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Users = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetUsers.rejected, (state, action) => {
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
      .addCase(Dleteusetr.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Dleteusetr.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(Dleteusetr.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(Edituser.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Edituser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
        message.success(action.payload?.message);
      })

      .addCase(Edituser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  UserSlice.actions;
export default UserSlice.reducer;

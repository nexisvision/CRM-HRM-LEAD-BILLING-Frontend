import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./UserService";
import axios from "axios";
import { message } from "antd";
import { env } from "configs/EnvironmentConfig";



export const AddUserss = createAsyncThunk(
  "users/adduser",
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
  "users/getUsers", // action type
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
  "users/Dleteuser",
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
        // message.success(action.payload?.data?.message);
      })
      .addCase(GetUsers.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //getall

      //getuserbyid
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.user;
        message.success(action.payload?.message);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
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


export default UserSlice.reducer;

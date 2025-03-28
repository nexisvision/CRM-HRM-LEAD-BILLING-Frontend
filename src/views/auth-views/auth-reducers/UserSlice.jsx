import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./UserService";
import { toast } from "react-toastify";
import { message } from "antd";

export const forgotpass = createAsyncThunk(
  "users/forgotpass",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.forgotpass(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const forgototp = createAsyncThunk(
  "users/forgototp",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.forgototps(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetpass = createAsyncThunk(
  "users/resetpass",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.resetpass(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




export const addNewUser = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addUser(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const userLogin = createAsyncThunk(
  "users/userLogin",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.userLoginapi(loginData);
      if (response) {
        localStorage.setItem("isAuth", JSON.stringify(true));
        localStorage.setItem("USER", JSON.stringify(response.data.user));
        localStorage.setItem("auth_token", JSON.stringify(response.data.token));
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const autol = createAsyncThunk(
  "users/autolog",
  async ({ localemail, localtoken }, thunkAPI) => {
    try {
      const response = await UserService.autologin(localemail, localtoken);
      if (response) {
        localStorage.setItem("isAuth", JSON.stringify(true));
        localStorage.setItem("USER", JSON.stringify(response.data.user));
        localStorage.setItem("auth_token", JSON.stringify(response.data.token));
      }
      return response;
    } catch (error) {
      console.error("Autologin error:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
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


export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteUser(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  "users/updateusers",
  async (user, thunkAPI) => {
    try {
      const response = await UserService.updateUser(user);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const updateSuperAdmin = createAsyncThunk(
  "users/updatesuperadmin",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await UserService.updatesuperadmin(id, data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a user

const initialUser = () => {
  const item = window.localStorage.getItem("USER");
  return item ? JSON.parse(item) : null;
};

const initialIsAuth = () => {
  const item = window.localStorage.getItem("isAuth");
  return item ? JSON.parse(item) : false;
};

const usersSlice = createSlice({
  name: "user",
  initialState: {
    isAuth: initialIsAuth(),
    loggedInUser: initialUser(),
    employees: [],
    editItem: {},
    detailItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },

  extraReducers: (builder) => {
    builder

      ////


      .addCase(forgotpass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotpass.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(forgotpass.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(forgototp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgototp.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(forgototp.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(resetpass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetpass.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(resetpass.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })



      //add
      .addCase(addNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })
      // login
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.loggedInUser = action.payload.user;
        message.success(action.payload?.message);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(autol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(autol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.loggedInUser = action.payload.user;
        message.success(action.payload.message);
      })
      .addCase(autol.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
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
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      .addCase(updateSuperAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(updateSuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      });


  },
});


export default usersSlice.reducer;

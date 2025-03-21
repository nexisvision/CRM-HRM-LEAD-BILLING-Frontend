import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./CompanyService";
import { toast } from "react-toastify";

export const sendmailupdateotp = createAsyncThunk(
  "users/sendmailupdateotp",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.sendemailotp(idd, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const otpverifyemail = createAsyncThunk(
  "users/otpverifyemail",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.otpverify(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addassignplan = createAsyncThunk(
  "users/addassignplan",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.assignplan(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

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
export const Editclients = createAsyncThunk(
  "users/updateEmployee",
  async ({ comnyid, formData }, thunkAPI) => {
    try {
      const response = await UserService.EditClientss(comnyid, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

const CompanySlice = createSlice({
  name: "ClientData",
  initialState: {
    ClientData: [],
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

      .addCase(sendmailupdateotp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendmailupdateotp.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(sendmailupdateotp.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })



      .addCase(otpverifyemail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(otpverifyemail.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(otpverifyemail.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(addassignplan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addassignplan.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addassignplan.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })
      .addCase(addClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(ClientData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ClientData = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(ClientData.rejected, (state, action) => {
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
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })
      //update
      .addCase(Editclients.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editclients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        // message.success(action.payload?.message);
      })
      .addCase(Editclients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  CompanySlice.actions;
export default CompanySlice.reducer;

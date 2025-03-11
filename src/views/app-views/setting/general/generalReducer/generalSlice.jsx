import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./generalService";
import { toast } from "react-toastify";
import { message } from "antd";



export const creategenaralsett = createAsyncThunk(
  "users/addtgg",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.creategenaral(userData);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getgeneralsettings = createAsyncThunk(
  "emp/getgenaral",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.getgeneralsetting(loginData);
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


export const deletesettingss = createAsyncThunk(
  "users/Deletese",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletesetting(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editicket = createAsyncThunk(
  "users/Editicket",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.Editticket(idd, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const TicketSlice = createSlice({
  name: "generalsetting",
  initialState: {
    generalsetting: [],
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
      .addCase(creategenaralsett.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(creategenaralsett.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(creategenaralsett.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getgeneralsettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getgeneralsettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalsetting = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getgeneralsettings.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deletesettingss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletesettingss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletesettingss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(Editicket.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
        // Update the state with the updated employee data
      })
      .addCase(Editicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });


  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData, toggleDetailModal, closeDetailModal } =
  TicketSlice.actions;
export default TicketSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./DealService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

export const AddDeals = createAsyncThunk(
  "users/AddDeals",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.CreateDeals(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const GetDeals = createAsyncThunk("emp/GetDeals", async (thunkAPI) => {
  try {
    const response = await UserService.DealsData();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
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

export const DeleteDeals = createAsyncThunk(
  "users/DeleteDeals",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteDeals(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditDeals = createAsyncThunk(
  "users/EditDeals",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.EditDeals(id, values);
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

const DealSlice = createSlice({
  name: "Deals",
  initialState: {
    Deals: [],
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
      .addCase(AddDeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddDeals.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(GetDeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Deals = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetDeals.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      
     
      //delete
      .addCase(DeleteDeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload.message);
      })
      .addCase(DeleteDeals.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(EditDeals.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(EditDeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  DealSlice.actions;
export default DealSlice.reducer;

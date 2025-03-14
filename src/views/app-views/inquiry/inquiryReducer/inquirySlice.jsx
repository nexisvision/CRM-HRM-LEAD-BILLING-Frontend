import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./inquiryService";
import { toast } from "react-toastify";


export const addinqu = createAsyncThunk(
  "users/addinqu",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addinq(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getinqu = createAsyncThunk("emp/getinqu", async (thunkAPI) => {
  try {
    const response = await UserService.getinq();
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

export const deleteinqu = createAsyncThunk(
  "users/deleteinqu",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.delinq(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editinqu = createAsyncThunk(
  "users/editinqu",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.editinq(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const RoleAndPermissionSlice = createSlice({
  name: "inquiry",
  initialState: {
    inquiry: [],
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
      .addCase(addinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(addinqu.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })


      .addCase(getinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiry = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getinqu.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall

      //delete
      .addCase(deleteinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(deleteinqu.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })
      //update

      .addCase(editinqu.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        // message.success(action.payload?.message);
      })

      .addCase(editinqu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

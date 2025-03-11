import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./vendorService";
import { message } from "antd";



export const vendordataeaddd = createAsyncThunk(
  "users/vendordataeaddd",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.vendordataadd(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const vendordataedata = createAsyncThunk(
  "emp/vendordataedata",
  async (thunkAPI) => {
    try {
      const response = await UserService.vendordata();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const vendordatadeletee = createAsyncThunk(
  "users/vendordatadeletee",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.vendordatadlete(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const vendordataeditt = createAsyncThunk(
  "users/vendordataeditt",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.vendordataedit(idd, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Async thunk for updating a user



const ContractSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
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
      .addCase(vendordataeaddd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendordataeaddd.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(vendordataeaddd.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(vendordataedata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendordataedata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action?.payload;
      })

      .addCase(vendordataedata.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      //delete
      .addCase(vendordatadeletee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(vendordatadeletee.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(vendordatadeletee.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(vendordataeditt.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(vendordataeditt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })

      .addCase(vendordataeditt.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      });

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  ContractSlice.actions;
export default ContractSlice.reducer;

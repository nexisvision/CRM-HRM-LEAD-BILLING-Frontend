import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./EsignatureService";
import { toast } from "react-toastify";
import { message } from "antd";



export const addesig = createAsyncThunk(
  "users/addesig",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addesignature(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getsignaturesss = createAsyncThunk(
  "emp/getsignaturesss",
  async (thunkAPI) => {
    try {
      const response = await UserService.getsignature();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deletesigssss = createAsyncThunk(
  "users/deletesigssss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletesig(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




const EsignatureSlice = createSlice({
  name: "esignature",
  initialState: {
    esignature: [],
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
      .addCase(addesig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addesig.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(addesig.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getsignaturesss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsignaturesss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esignature = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getsignaturesss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deletesigssss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletesigssss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletesigssss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  EsignatureSlice.actions;
export default EsignatureSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./AppraisalService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";

// Async thunk for adding user

export const addAppraisals = createAsyncThunk(
  "users/addAppraisals",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.addAppraisal(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const getAppraisals = createAsyncThunk(
  "emp/getAppraisals",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAppraisals();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all users
export const getAllAppraisals = createAsyncThunk(
  "users/getAllAppraisals",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAllAppraisals();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting user by id
export const getAppraisalById = createAsyncThunk(
  "users/getAppraisalById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getAppraisalById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a user
export const deleteAppraisal = createAsyncThunk(
  "users/deleteAppraisal",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteAppraisal(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editAppraisal = createAsyncThunk(
  "users/editAppraisal",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.editAppraisal(id, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating Appraisal"
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

const AppraisalSlice = createSlice({
  name: "Appraisal",
  initialState: {
    Appraisals: [],
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
      .addCase(addAppraisals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAppraisals.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addAppraisals.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getAppraisals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppraisals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Appraisals = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getAppraisals.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall
      .addCase(getAllAppraisals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAppraisals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Appraisals = action.payload;
        toast.success(`Appraisals fetched successfully`);
      })
      .addCase(getAllAppraisals.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      //getuserbyid
      .addCase(getAppraisalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppraisalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.appraisal;
        toast.success(action.payload.message);
      })
      .addCase(getAppraisalById.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deleteAppraisal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAppraisal.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteAppraisal.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editAppraisal.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editAppraisal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.appraisal; // Update the state with the updated employee data
        toast.success(action.payload.message);
      })
      .addCase(editAppraisal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  AppraisalSlice.actions;
export default AppraisalSlice.reducer;

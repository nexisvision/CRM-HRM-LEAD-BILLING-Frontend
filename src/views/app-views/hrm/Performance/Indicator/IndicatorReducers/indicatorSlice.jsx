import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./indicatorService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";


export const addIndicator = createAsyncThunk(
  "users/AddIndicator",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.addIndicator(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getIndicators = createAsyncThunk(
  "emp/getIndicators",
  async (thunkAPI) => {
    try {
      const response = await UserService.getIndicators();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllIndicators = createAsyncThunk(
  "users/getAllIndicators",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAllIndicators();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getIndicatorById = createAsyncThunk(
  "users/getIndicatorById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getIndicatorById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteIndicator = createAsyncThunk(
  "users/deleteIndicator",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteIndicator(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editIndicator = createAsyncThunk(
  "users/editIndicator",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.editIndicator(id, values);
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating Indicator"
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

const IndicatorSlice = createSlice({
  name: "Indicator",
  initialState: {
    Indicators: [],
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
      .addCase(addIndicator.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addIndicator.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(addIndicator.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getIndicators.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIndicators.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Indicators = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getIndicators.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall
      .addCase(getAllIndicators.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIndicators.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Indicators = action.payload;
        toast.success(`Indicators fetched successfully`);
      })
      .addCase(getAllIndicators.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      //getuserbyid
      .addCase(getIndicatorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIndicatorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.indicator;
        message.success(action.payload.message);
      })
      .addCase(getIndicatorById.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.message);
      })

      //delete
      .addCase(deleteIndicator.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteIndicator.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload.message);
      })

      .addCase(deleteIndicator.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.message);
      })

      //update
      .addCase(editIndicator.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editIndicator.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.indicator; // Update the state with the updated employee data
        message.success(action.payload.message);
      })

      .addCase(editIndicator.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.response?.message);
      });

  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  IndicatorSlice.actions;
export default IndicatorSlice.reducer;
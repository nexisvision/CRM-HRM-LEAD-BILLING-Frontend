import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./holidayService";
import { toast } from "react-toastify";



export const addsholidayss = createAsyncThunk(
  "users/addsholidaysss",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.addholidayss(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getsholidayss = createAsyncThunk(
  "emp/getsholidayss",
  async (thunkAPI) => {
    try {
      const response = await UserService.getholidayss();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);





export const getAttendanceById = createAsyncThunk(
  "users/getAttendanceById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getAttendanceById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deltsholidayss = createAsyncThunk(
  "users/deltsholidayss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.dlholidayss(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editsholidayss = createAsyncThunk(
  "users/editsholidayss",
  async ({ idd, formattedValues }, thunkAPI) => {
    try {
      const response = await UserService.editholidayss(idd, formattedValues);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating Appraisal"
      );
    }
  }
);



const AttendanceSlice = createSlice({
  name: "holidays",
  initialState: {
    holidays: [],
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
      .addCase(addsholidayss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addsholidayss.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addsholidayss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getsholidayss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getsholidayss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.holidays = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getsholidayss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //getuserbyid
      .addCase(getAttendanceById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.attendance;
        toast.success(action.payload.message);
      })
      .addCase(getAttendanceById.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deltsholidayss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deltsholidayss.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deltsholidayss.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editsholidayss.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editsholidayss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.attendance; // Update the state with the updated employee data
        toast.success(action.payload.message);
      })
      .addCase(editsholidayss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update Attendance";
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  AttendanceSlice.actions;
export default AttendanceSlice.reducer;

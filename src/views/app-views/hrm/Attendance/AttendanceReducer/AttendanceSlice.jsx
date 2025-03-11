import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./AttendanceService";
import { toast } from "react-toastify";

export const addAttendance = createAsyncThunk(
  "users/addAttendances",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.addAttendance(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getAttendances = createAsyncThunk(
  "emp/getAttendances",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAttendances();
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


export const deleteAttendance = createAsyncThunk(
  "users/deleteAttendance",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteAttendance(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editAttendance = createAsyncThunk(
  "users/editAttendance",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.editAttendance(id, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating Appraisal"
      );
    }
  }
);



const AttendanceSlice = createSlice({
  name: "Attendance",
  initialState: {
    Attendances: [],
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
      .addCase(addAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getAttendances.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Attendances = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getAttendances.rejected, (state, action) => {
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
      .addCase(deleteAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editAttendance.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.attendance; // Update the state with the updated employee data
        toast.success(action.payload.message);
      })
      .addCase(editAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update Attendance";
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  AttendanceSlice.actions;
export default AttendanceSlice.reducer;

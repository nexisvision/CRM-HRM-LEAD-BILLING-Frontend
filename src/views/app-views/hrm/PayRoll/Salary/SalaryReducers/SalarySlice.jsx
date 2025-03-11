import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./SalaryService";
import { message } from "antd";

export const editSalaryss = createAsyncThunk(
  "salary/editSalaryss",
  async (payload, thunkAPI) => {
    try {
      const salaryData = {
        id: payload.id,
        employeeId: payload.employeeId,
        payslipType: payload.payslipType,
        currency: payload.currency,
        salary: payload.salary,
        netSalary: payload.netSalary,
        status: payload.status,
        bankAccount: payload.bankAccount,
        created_by: payload.created_by
      };

      const response = await UserService.editsal(salaryData.id, salaryData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating salary"
      );
    }
  }
);

export const AddSalaryss = createAsyncThunk(
  "salary/AddSalaryss",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addsal(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding salary");
    }
  }
);

export const getSalaryss = createAsyncThunk(
  "salary/getSalaryss",
  async (_, thunkAPI) => {
    try {
      const response = await UserService.getsal();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching salaries");
    }
  }
);

export const deleteSalaryss = createAsyncThunk(
  "salary/deleteSalaryss",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deletsal(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error deleting salary");
    }
  }
);

const SalarySlice = createSlice({
  name: "salary",
  initialState: {
    salary: {
      data: [],
      loading: false,
      error: null
    },
    isLoading: false,
    error: null,
    addModel: false,
    editModal: false,
    editItem: {}
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Get salaries
      .addCase(getSalaryss.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salary = action.payload;
      })
      .addCase(getSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
        message.error(action.payload?.message || "Failed to fetch salaries");
      })

      // Add salary
      .addCase(AddSalaryss.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message || "Salary added successfully");
      })
      .addCase(AddSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message || "Failed to add salary");
      })

      // Delete salary
      .addCase(deleteSalaryss.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message || "Salary deleted successfully");
      })
      .addCase(deleteSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message || "Failed to delete salary");
      })

      // Edit salary
      .addCase(editSalaryss.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editSalaryss.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.salary.data) {
          const index = state.salary.data.findIndex(
            (item) => item.id === action.payload.data.id
          );
          if (index !== -1) {
            state.salary.data[index] = action.payload.data;
          }
        }
        message.success(action.payload?.message || "Salary updated successfully");
      })
      .addCase(editSalaryss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message || "Failed to update salary");
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } = SalarySlice.actions;
export default SalarySlice.reducer;

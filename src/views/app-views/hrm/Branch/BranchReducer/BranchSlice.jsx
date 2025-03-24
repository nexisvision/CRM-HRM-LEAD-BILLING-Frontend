import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BranchService from "./BranchService";
import { toast } from "react-toastify";
import { message } from "antd";

export const AddBranchs = createAsyncThunk(
  "users/AddBranchs",
  async (values, thunkAPI) => {
    try {
      const response = await BranchService.addbra(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getBranch = createAsyncThunk(
  "emp/getBranch",
  async (thunkAPI) => {
    try {
      const response = await BranchService.getbra();
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
      const response = await BranchService.getAllUsers();
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
      const response = await BranchService.getUserById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteBranch = createAsyncThunk(
  "users/deleteBrancheet",
  async (userId, thunkAPI) => {
    try {
      const response = await BranchService.deletebra(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editBranch = createAsyncThunk(
  "users/editBranch",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await BranchService.editbra(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const BranchSlice = createSlice({
  name: "Branch",
  initialState: {
    Branch: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
 
  extraReducers: (builder) => {
    builder
      //add
      .addCase(AddBranchs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddBranchs.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddBranchs.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Branch = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getBranch.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })

      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(editBranch.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
        message.success(action.payload?.message);
      })

      .addCase(editBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
        });

  },
});

export default BranchSlice.reducer;

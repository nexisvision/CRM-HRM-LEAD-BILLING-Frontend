import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PolicyService from "./policyService";
import { toast } from "react-toastify";
import { message } from "antd";

export const Addpolicys = createAsyncThunk(
  "policy/Addpolicys",
  async (userData, thunkAPI) => {
    try {
      const response = await PolicyService.addpolicy(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getpolicys = createAsyncThunk(
  "policy/getpolicys",
  async (thunkAPI) => {
    try {
      const response = await PolicyService.getpolicy();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deletepolicys = createAsyncThunk(
  "policy/deletepolicys",
  async (userId, thunkAPI) => {
    try {
      const response = await PolicyService.deletepolicy(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const editpolicys = createAsyncThunk(
  "policy/editpolicys",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await PolicyService.editpolicy(idd, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const policySlice = createSlice({
  name: "policy",
  initialState: {
    policy: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  
  extraReducers: (builder) => {
    builder
      //add
      .addCase(Addpolicys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Addpolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(Addpolicys.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })

      .addCase(getpolicys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getpolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policy = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getpolicys.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

  
      //delete
      .addCase(deletepolicys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletepolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(deletepolicys.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.data?.message);
      })

      //update
      .addCase(editpolicys.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editpolicys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload; // Update the state with the updated employee data
        // message.success(action.payload?.message);
      })

      .addCase(editpolicys.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      });

  },
});

export default policySlice.reducer;

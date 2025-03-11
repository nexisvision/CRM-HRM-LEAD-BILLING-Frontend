import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { message } from "antd";
import DebitService from "./DebitService";


// Get all debit notes
export const getAllDebitNotes = createAsyncThunk(
  "debit/getAllDebitNotes",
  async (_, thunkAPI) => {
    try {
      const response = await DebitService.GetAllDebit();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create debit note
export const createDebitNote = createAsyncThunk(
  "debit/createDebitNote",
  async (debitData, thunkAPI) => {
    try {
      const response = await DebitService.CreateDebit(debitData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const debitSlice = createSlice({
  name: "debitNotes",
  initialState: {
    debitNotes: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all debit notes
      .addCase(getAllDebitNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDebitNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.debitNotes = action.payload.data;
      })
      .addCase(getAllDebitNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message || "Failed to fetch debit notes");
      })
      // Create debit note
      .addCase(createDebitNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDebitNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.debitNotes.push(action.payload.data);
        message.success("Debit note created successfully");
      })
      .addCase(createDebitNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message || "Failed to create debit note");
      });
  },
});

export const { clearState } = debitSlice.actions;
export default debitSlice.reducer;

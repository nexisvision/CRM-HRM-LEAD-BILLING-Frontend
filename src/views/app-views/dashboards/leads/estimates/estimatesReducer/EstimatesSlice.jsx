import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EstimateService from './EstimatesService';
import { message } from 'antd';

export const createestimate = createAsyncThunk(
  'estimate/createEstimate',
  async ({ id, estimateData }, { rejectWithValue }) => {
    try {
      const response = await EstimateService.createEstimate(id, estimateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create estimate');
    }
  }
);

export const getallestimate = createAsyncThunk(
  'estimate/getAllEstimate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await EstimateService.getAllEstimate(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch estimates');
    }
  }
);

export const getestimateById = createAsyncThunk(
  "estimate/getEstimateById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await EstimateService.getEstimateById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch invoice");
    }
  }
);

export const updateestimate = createAsyncThunk(
  'estimate/updateEstimate',
  async ({ idd, data }, { rejectWithValue }) => {
    try {
      const response = await EstimateService.updateEstimate(idd, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update estimate');
    }
  }
);

export const deleteestimate = createAsyncThunk(
  "estimate/deleteEstimate",
  async (id, { rejectWithValue }) => {
    try {
      await EstimateService.deleteEstimate(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete estimate"
      );
    }
  }
);

const estimateSlice = createSlice({
  name: 'leadestimate',
  initialState: {
    leadestimates: [],
    currentEstimate: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetEstimateState: (state) => {
      state.currentEstimate = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.leadestimates.push(action.payload.data);
        state.success = true;
        message.success(action.payload?.message);
      })
      .addCase(createestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      })

      .addCase(getallestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.leadestimates = action.payload.data;
      })
      .addCase(getallestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single invoice
      .addCase(getestimateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getestimateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEstimate = action.payload;
      })
      .addCase(getestimateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update estimate
      .addCase(updateestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.leadestimates.findIndex(
          (estimate) => estimate._id === action.payload.data._id
        );
        if (index !== -1) {
          state.leadestimates[index] = action.payload.data;
        }
        message.success(action.payload?.message);

      })
      .addCase(updateestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message);

      })

      // Delete estimate
      .addCase(deleteestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.leadestimates = state.leadestimates.filter(
          (estimate) => estimate._id !== action.payload
        );
        state.success = true;
        message.success(action.payload?.message);
      })
      .addCase(deleteestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { clearError, clearSuccess, resetEstimateState } = estimateSlice.actions;
export default estimateSlice.reducer;

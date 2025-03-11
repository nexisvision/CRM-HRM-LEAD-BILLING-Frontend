import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import QuotationsService from '../../estimates/estimatesReducer/EstimatesService';

export const getallquotations = createAsyncThunk(
  'quotation/getAllQuotations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await QuotationsService.getAllQuotations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Quotations');
    }
  }
);
export const getquotationsById = createAsyncThunk(
  'quotation/getQuotationsById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await QuotationsService.getQuotationsById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Quotation');
    }
  }
);
export const createquotations = createAsyncThunk(
  'quotation/createQuotations',
  async (quotationData, { rejectWithValue }) => {
    try {
      const response = await QuotationsService.createQuotations(quotationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updatequotation = createAsyncThunk(
  'quotation/updateQuotations',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await QuotationsService.updateQuotations(id, values);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update quotation');
    }
  }
);
export const deletequotations = createAsyncThunk(
  "quotation/deleteQuotations",
  async (id, thunkAPI) => {
    try {
      const response = await QuotationsService.deleteQuotations(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// Slice
const initialState = {
  salesquotations: [],
  currentQuotation: null,  // Add this for single quotation
  loading: false,
  error: null,
  success: false,
  addModel: false,
  editModal: false,
};

const quotationsSlice = createSlice({
  name: 'salesquotations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
      state.editItem = {};
    },
    resetEstimateState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all quotations
      .addCase(getallquotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallquotations.fulfilled, (state, action) => {
        state.loading = false;
        state.salesquotations = action.payload;
      })
      .addCase(getallquotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get single quotation
      .addCase(getquotationsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getquotationsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuotation = action.payload; // Store in currentQuotation
        state.error = null;
      })
      .addCase(getquotationsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentQuotation = null;
      })
      // Create invoice
      .addCase(createquotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createquotations.fulfilled, (state, action) => {
        state.loading = false;
        state.salesquotations.push(action.payload);
        state.success = true;
      })
      .addCase(createquotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update invoice
      .addCase(updatequotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatequotation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.editItem = action.payload;
      })
      .addCase(updatequotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //delete
      .addCase(deletequotations.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletequotations.fulfilled, (state, action) => {
        state.loading = false;
        state.success(action.payload.message);
      })
      .addCase(deletequotations.rejected, (state, action) => {
        state.loading = false;
        state.error(action.payload?.response?.data?.message);
      })
  },
});
export const { clearError, clearSuccess, resetEstimateState, toggleEditModal } = quotationsSlice.actions;
export default quotationsSlice.reducer;





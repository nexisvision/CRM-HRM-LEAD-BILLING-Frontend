import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import InvoiceService from '../../../project/invoice/invoicereducer/InvoiceService';

// Async thunks
export const getAllInvoices = createAsyncThunk(
  'invoice/getAllInvoices',
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getAllInvoices(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invoices');
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  'invoice/getInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getInvoiceById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invoice');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }
      const response = await InvoiceService.createInvoice(id, invoiceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoice/updateInvoice',
  async ({ id,data }, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.updateInvoice(id,data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update invoice');
    }
  }
);

// Delete invoice thunk
export const deleteInvoice = createAsyncThunk(
  'invoice/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.deleteInvoice(id);
      return id; // Return the ID for filtering
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete invoice');
    }
  }
);

export const getMilestoneDetails = createAsyncThunk(
  'invoice/getMilestoneDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getMilestoneDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch milestone details');
    }
  }
);

// export const fetchInvoiceStats = createAsyncThunk(
//   'invoice/fetchInvoiceStats',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await InvoiceService.getInvoiceStats();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch invoice statistics');
//     }
//   }
// );

// Slice
const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoices: [],
    currentInvoice: null,
    statistics: null,
    loading: false,
    error: null,
    success: false,
    selectedMilestone: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetInvoiceState: (state) => {
      state.currentInvoice = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(getAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data; // Access the invoices array from response
        state.error = null;
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ... existing reducers ...
      .addCase(getMilestoneDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMilestoneDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMilestone = action.payload;
      })
      .addCase(getMilestoneDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single invoice
      .addCase(getInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
        state.success = true;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.invoices.findIndex(
          (invoice) => invoice.id === action.payload.id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload; // Update the invoice
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch statistics
    //   .addCase(fetchInvoiceStats.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchInvoiceStats.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.statistics = action.payload;
    //   })
    //   .addCase(fetchInvoiceStats.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  },
});

export const { clearError, clearSuccess, resetInvoiceState } = invoiceSlice.actions;

export default invoiceSlice.reducer;
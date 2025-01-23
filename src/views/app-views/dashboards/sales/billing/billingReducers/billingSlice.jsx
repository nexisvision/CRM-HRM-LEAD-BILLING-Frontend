import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BillingService from "../billingReducers/billingService";

// Async thunks
export const getAllBillings = createAsyncThunk(
  "invoice/getAllBillings",
  async (lid, { rejectWithValue }) => {
    try {
      const response = await BillingService.getAllBillings(lid);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch billings"
      );
    }
  }
);

export const getBillingById = createAsyncThunk(
  "invoice/getBillingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await BillingService.getBillingById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch billing");
    }
  }
);

export const createBilling = createAsyncThunk(
  "invoice/createBilling",
  async ({ lid, billingData }, { rejectWithValue }) => {
    try {
      if (!lid) {
        throw new Error("Product ID is required");
      }
      const response = await BillingService.createBilling(lid, billingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create billing");
    }
  }
);

export const updateBilling = createAsyncThunk(
  "invoice/updateBilling",
  async ({ idd, data }, { rejectWithValue }) => {
    try {
      const response = await BillingService.updateBilling(idd, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update billing"
      );
    }
  }
);

// Delete invoice thunk
export const deleteBilling = createAsyncThunk(
  "invoice/deleteBilling",
  async (id, { rejectWithValue }) => {
    try {
      const response = await BillingService.deleteBilling(id);
      return id; // Return the ID for filtering
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete billing"
      );
    }
  }
);





// Slice
const billingSlice = createSlice({
  name: "salesbilling",
  initialState: {
    billings: [],
    currentBilling: null,
    statistics: null,
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
    resetBillingState: (state) => {
      state.currentBilling = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(getAllBillings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBillings.fulfilled, (state, action) => {
        state.loading = false;
        state.billings = action.payload.data; // Access the invoices array from response
        state.error = null;
      })
      .addCase(getAllBillings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

 

      // Fetch single invoice
      .addCase(getBillingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBilling = action.payload;
      })
      .addCase(getBillingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create invoice
      .addCase(createBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billings.push(action.payload);
        state.success = true;
      })
      .addCase(createBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice
      .addCase(updateBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.billings.findIndex(
          (billing) => billing.id === action.payload.id
        );
        if (index !== -1) {
          state.billings[index] = action.payload; // Update the invoice
        }
      })
      .addCase(updateBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete invoice
      .addCase(deleteBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billings = state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
        state.success = true;
        // toast.success("Invoice deleted");
      })
      .addCase(deleteBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearError, clearSuccess, resetBillingState } =
  billingSlice.actions;

export default billingSlice.reducer;


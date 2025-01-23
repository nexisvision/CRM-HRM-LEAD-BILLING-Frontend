import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import InvoiceService from "./proposalService";

// Async thunks
export const getAllProposals = createAsyncThunk(
  "invoice/getAllProposals",
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getAllProposals(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch proposals"
      );
    }
  }
);

export const getProposalById = createAsyncThunk(
  "invoice/getProposalById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getProposalById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch proposal");
    }
  }
);

export const createProposal = createAsyncThunk(
  "invoice/createProposal",
  async ({ values }, { rejectWithValue }) => {
    try {
     
      const response = await InvoiceService.createProposal(values);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create proposal");
    }
  }
);

export const updateProposal = createAsyncThunk(
  "invoice/updateProposal",
  async ({ idd, data }, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.updateProposal(idd, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update proposal"
      );
    }
  }
);

// Delete invoice thunk
export const deleteProposal = createAsyncThunk(
  "invoice/deleteProposal",
  async (id, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.deleteProposal(id);
      return id; // Return the ID for filtering
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete proposal"
      );
    }
  }
);





// Slice
const proposalSlice = createSlice({
  name: "proposal",
  initialState: {
    proposals: [],
    currentProposal: null,
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
    resetInvoiceState: (state) => {
      state.currentInvoice = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(getAllProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload.data; // Access the invoices array from response
        state.error = null;
      })
      .addCase(getAllProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

 

      // Fetch single invoice
      .addCase(getProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProposalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProposal = action.payload;
      })
      .addCase(getProposalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create invoice
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals.push(action.payload);
        state.success = true;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.proposals.findIndex(
          (proposal) => proposal.id === action.payload.id
        );
        if (index !== -1) {
          state.proposals[index] = action.payload; // Update the invoice
        }
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete invoice
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals.filter(
          (proposal) => proposal._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearError, clearSuccess, resetInvoiceState } =
  proposalSlice.actions;

export default proposalSlice.reducer;


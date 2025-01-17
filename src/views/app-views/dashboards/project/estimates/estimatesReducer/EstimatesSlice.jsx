import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EstimateService from './EstimatesService';

// Create estimate
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

// Fetch all estimates
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

// Fetch single invoice
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

// Update estimate
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

// Delete invoice thunk
export const deleteestimate = createAsyncThunk(
  "estimate/deleteEstimate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await EstimateService.deleteEstimate(id);
      return id; // Return the ID for filtering
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete estimate"
      );
    }
  }
);

const estimateSlice = createSlice({
  name: 'estimate',
  initialState: {
    estimates: [],
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
      // Create estimate
      .addCase(createestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimates.push(action.payload.data);
        state.success = true;
      })
      .addCase(createestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all estimates
      .addCase(getallestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimates = action.payload.data;
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
        // Update the estimate in the list
        const index = state.estimates.findIndex(
          (estimate) => estimate._id === action.payload.data._id
        );
        if (index !== -1) {
          state.estimates[index] = action.payload.data;
        }
      })
      .addCase(updateestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete estimate
        .addCase(deleteestimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteestimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimates = state.estimates.filter(
          (estimate) => estimate._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteestimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetEstimateState } = estimateSlice.actions;
export default estimateSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import EstimateService from '../../estimates/estimatesReducer/EstimatesService';

// // Async thunks
// // export const getallestimate = createAsyncThunk(
// //   'estimate/getAllEstimate',
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       const response = await EstimateService.getAllEstimate(id);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data || 'Failed to fetch invoices');
// //     }
// //   }
// // );

// export const getallestimate = createAsyncThunk(
//   'estimate/getAllEstimate',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await EstimateService.getAllEstimate(id);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch estimate');
//     }
//   }
// );

// export const getestimateById = createAsyncThunk(
//   'estimate/getEstimateById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await EstimateService.getEstimateById(id);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch invoice');
//     }
//   }
// );

// export const createestimate = createAsyncThunk(
//   'estimate/createEstimate',
//   async ({ id, estimateData }, { rejectWithValue }) => {
//     try {
//       if (!id) {
//         return rejectWithValue('Project ID is required');
//       }

//       const response = await EstimateService.createEstimate(id, estimateData);

//       if (response.success) {
//         return response; // Return the entire response for state update
//       } else {
//         return rejectWithValue(response.message || 'Failed to create estimates');
//       }
//     } catch (error) {
//       console.error('Error in Redux Thunk:', error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const updateestimate = createAsyncThunk(
//   'estimate/updateEstimate',
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await EstimateService.updateEstimate(id, data);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to update invoice');
//     }
//   }
// );

// // Delete invoice thunk
// export const deleteestimate = createAsyncThunk(
//   'estimate/deleteEstimate',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await EstimateService.deleteEstimate(id);
//       return response; // Return the ID for filtering
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to delete invoice');
//     }
//   }
// );




// // Slice
// const estimateSlice = createSlice({
//   name: 'estimate',
//   initialState: {
//     estimates: [],
//     currentEstimates: null,
//     statistics: null,
//     loading: false,
//     error: null,
//     success: false,
//     // selectedMilestone: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = false;
//     },
//     resetEstimateState: (state) => {
//       state.currentEstimates = null;
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all invoices
//       .addCase(getallestimate.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getallestimate.fulfilled, (state, action) => {
//         state.loading = false;
//         state.estimates = action.payload.data; // Populate the estimates
//       })
//       .addCase(getallestimate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error
//       })


//       // Fetch single invoice
//       //   .addCase(getestimateById.pending, (state) => {
//       //     state.loading = true;
//       //     state.error = null;
//       //   })
//       //   .addCase(getestimateById.fulfilled, (state, action) => {
//       //     state.loading = false;
//       //     state.currentEstimates = action.payload;
//       //   })
//       //   .addCase(getestimateById.rejected, (state, action) => {
//       //     state.loading = false;
//       //     state.error = action.payload;
//       //   })

//       // Create invoice
//       .addCase(createestimate.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//     .addCase(createestimate.fulfilled, (state, action) => {
//       state.loading = false;
//       state.estimates.push(action.payload);
//       state.success = true;
//     })
//     .addCase(createestimate.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     })

//   // Update invoice
//   //   .addCase(updateInvoice.pending, (state) => {
//   //     state.loading = true;
//   //     state.error = null;
//   //   })
//   //   .addCase(updateInvoice.fulfilled, (state, action) => {
//   //     state.loading = false;
//   //     state.success = true;
//   //     const index = state.invoices.findIndex(
//   //       (invoice) => invoice.id === action.payload.id
//   //     );
//   //     if (index !== -1) {
//   //       state.invoices[index] = action.payload; // Update the invoice
//   //     }
//   //   })
//   //   .addCase(updateInvoice.rejected, (state, action) => {
//   //     state.loading = false;
//   //     state.error = action.payload;
//   //   })

//   // Delete invoice
//   //   .addCase(deleteInvoice.pending, (state) => {
//   //     state.loading = true;
//   //     state.error = null;
//   //   })
//   //   .addCase(deleteInvoice.fulfilled, (state, action) => {
//   //     state.loading = false;
//   //     state.invoices = state.invoices.filter(
//   //       (invoice) => invoice._id !== action.payload
//   //     );
//   //     state.success = true;
//   //   })
//   //   .addCase(deleteInvoice.rejected, (state, action) => {
//   //     state.loading = false;
//   //     state.error = action.payload;
//   //   });

// },
// });

// export const { clearError, clearSuccess, resetEstimateState } = estimateSlice.actions;

// export default estimateSlice.reducer;


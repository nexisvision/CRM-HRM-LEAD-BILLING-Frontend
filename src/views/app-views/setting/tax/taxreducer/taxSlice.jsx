import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { message } from "antd";
import TaxService from "./taxService";


// Get all taxes
export const getAllTaxes = createAsyncThunk(
  "tax/getAllTaxes",
  async (_, thunkAPI) => {
    try {
      const response = await TaxService.GetAllTax();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create tax
export const createTax = createAsyncThunk(
  "tax/createTax",
  async (taxData, thunkAPI) => {
    try {
      const response = await TaxService.CreateTax(taxData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update tax
export const updateTax = createAsyncThunk(
  "tax/updateTax",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await TaxService.UpdateTax(idd, values);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add delete tax thunk
export const deleteTax = createAsyncThunk(
  "tax/deleteTax",
  async (id, thunkAPI,dispatch) => {
    try {
      const response = await TaxService.DeleteTax(id);
      dispatch(getAllTaxes());
      return { id, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialUser = () => {
  const item = window.localStorage.getItem("USER");
  return item ? JSON.parse(item) : null;
};

const initialIsAuth = () => {
  const item = window.localStorage.getItem("isAuth");
  return item ? JSON.parse(item) : false;
};

const taxSlice = createSlice({
    name: 'tax',
    initialState: {
        taxes: [],
        editItem: {},
        loading: false,
        error: null,
        addModel: false,
        editModal: false,
    },
    reducers: {
        setSelectedTaxes: (state, action) => {
            state.selectedTaxes = action.payload;
        },
        clearTaxesState: (state) => {
            state.error = null;
            state.success = false;
            state.message = '';
        },
        toggleEditModal: (state, action) => {
            state.editModal = action.payload;
            state.editItem = {};
          },
          editTaxData: (state, action) => {
            state.editItem = action.payload;
            state.editModal = !state.editModal;
          },

    },
    extraReducers: (builder) => {
        builder
            // Get all taxes
            .addCase(getAllTaxes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTaxes.fulfilled, (state, action) => {
                state.loading = false;
                state.taxes = action.payload;
            })
            .addCase(getAllTaxes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload?.message);
            })
            // Create tax
            .addCase(createTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTax.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.taxes)) {
                    state.taxes.push(action.payload.data);
                } else {
                    state.taxes = state.taxes?.data ? 
                        [...state.taxes.data, action.payload.data] : 
                        [action.payload.data];
                }
                message.success(action.payload?.message || 'Tax created successfully');
            })
            .addCase(createTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload?.message || 'Failed to create tax');
            })
            // Update tax
            .addCase(updateTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTax.fulfilled, (state, action) => {
                state.editItem = action.payload.data;
                state.loading = false;
                message.success(action.payload?.message);
            })
            .addCase(updateTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload?.message);
            })
            // Add delete tax cases
            .addCase(deleteTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTax.fulfilled, (state, action) => {
                state.loading = false;
                state.taxes = state.taxes.filter(tax => tax.id !== action.payload.id);
                message.success(action.payload?.message || 'Tax deleted successfully');
            })
            .addCase(deleteTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                message.error(action.payload?.message || 'Failed to delete tax');
            });
    },
});

export const { setSelectedTaxes, clearTaxesState, toggleEditModal, editTaxData } = taxSlice.actions;    
export default taxSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching general settings
export const fetchGeneralSettings = createAsyncThunk(
  'generalSettings/fetchGeneralSettings',
  async () => {
    const response = await axios.get('/api/general-settings');
    return response.data;
  }
);

// Async thunk for updating general settings
export const updateGeneralSettings = createAsyncThunk(
  'generalSettings/updateGeneralSettings',
  async (data) => {
    const response = await axios.put('/api/general-settings', data);
    return response.data;
  }
);

const generalSettingsSlice = createSlice({
  name: 'generalSettings',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch general settings
      .addCase(fetchGeneralSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGeneralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchGeneralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update general settings
      .addCase(updateGeneralSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default generalSettingsSlice.reducer; 
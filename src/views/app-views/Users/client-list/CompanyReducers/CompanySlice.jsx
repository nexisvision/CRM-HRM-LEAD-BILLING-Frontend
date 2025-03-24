import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CompanyService from "./CompanyService";
import { message } from "antd";


export const addClient = createAsyncThunk(
  "client/addClient",
  async (userData, thunkAPI) => {
    try {
      const response = await CompanyService.createClient(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const ClientData = createAsyncThunk(
  "client/getClient",
  async (thunkAPI) => {
    try {
      const response = await CompanyService.ClientData();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async (userId, thunkAPI) => {
    try {
      const response = await CompanyService.DeleteClient(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editclient = createAsyncThunk(
  "client/updateClient",
  async ({ comnyid, formData }, thunkAPI) => {
    try {
      const response = await CompanyService.EditClient(comnyid, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const CompanySlice = createSlice({
  name: "SubClient",
  initialState: {
    SubClient: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
 
  extraReducers: (builder) => {
    builder
      // Add Client
      .addCase(addClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false;
      })

      // Get Client Data
      .addCase(ClientData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SubClient = action?.payload;
      })
      .addCase(ClientData.rejected, (state, action) => {
        state.isLoading = false;
        message.error("Failed to fetch client data");
      })

      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action?.payload?.data?.message);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action?.payload?.data?.message);
      })

      // Edit Client
      .addCase(Editclient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Editclient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action?.payload?.data?.message);
      })
      .addCase(Editclient.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action?.payload?.data?.message);
      });
  },
});

export default CompanySlice.reducer;

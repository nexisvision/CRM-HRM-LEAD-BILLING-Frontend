import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./CompanyService";
import { toast } from "react-toastify";

export const sendmailupdateotp = createAsyncThunk(
  "users/sendmailupdateotp",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.sendemailotp(idd, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const otpverifyemail = createAsyncThunk(
  "users/otpverifyemail",
  async (values, thunkAPI) => {
    try {
      const response = await UserService.otpverify(values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addassignplan = createAsyncThunk(
  "users/addassignplan",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.assignplan(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addClient = createAsyncThunk(
  "client/addclient",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.createClient(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const registerClient = createAsyncThunk(
  "client/registerClient",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.registerClient(userData);
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
      const response = await UserService.ClientData();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteClient = createAsyncThunk(
  "client/deleteclient",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteClient(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editclients = createAsyncThunk(
  "client/updateclient",
  async ({ comnyid, formData }, thunkAPI) => {
    try {
      const response = await UserService.EditClientss(comnyid, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

const CompanySlice = createSlice({
  name: "ClientData",
  initialState: {
    ClientData: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  
  extraReducers: (builder) => {
    builder

      .addCase(sendmailupdateotp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendmailupdateotp.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(sendmailupdateotp.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })



      .addCase(otpverifyemail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(otpverifyemail.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(otpverifyemail.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(addassignplan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addassignplan.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addassignplan.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })
      .addCase(addClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(registerClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerClient.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerClient.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(ClientData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ClientData = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(ClientData.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      
      //delete
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })
      //update
      .addCase(Editclients.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editclients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        // message.success(action.payload?.message);
      })
      .addCase(Editclients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // message.error(action.payload?.message);
      });
  },
});

export default CompanySlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SettingService from "./generalService";
import { toast } from "react-toastify";
import { message } from "antd";



export const creategenaralsett = createAsyncThunk(
  "setting/addsett",
  async (userData, thunkAPI) => {
    try {
      const response = await SettingService.creategenaral(userData);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updategeneralsetting = createAsyncThunk(
  'setting/updatesett',
  async ({ id, data }) => {
    const response = await SettingService.updategeneralsetting(id, data);
    return response.data;
  }
);



export const getgeneralsettings = createAsyncThunk(
  "setting/getsett",
  async (loginData, thunkAPI) => {
    try {
      const response = await SettingService.getgeneralsetting(loginData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const deletesettingss = createAsyncThunk(
  "setting/Deletesett",
  async (userId, thunkAPI) => {
    try {
      const response = await SettingService.deletesetting(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const generalsettingSlice = createSlice({
  name: "generalsetting",
  initialState: {
    generalsetting: [],
    isLoading: false,
  },

  extraReducers: (builder) => {
    builder
      //add
      .addCase(creategenaralsett.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(creategenaralsett.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(creategenaralsett.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getgeneralsettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getgeneralsettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalsetting = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getgeneralsettings.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(deletesettingss.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletesettingss.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalsetting = action?.payload;
        
        message.success(action.payload?.message);
      })
      .addCase(deletesettingss.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(updategeneralsetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updategeneralsetting.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(updategeneralsetting.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      });
    
    

  },
});

export const {  } =
  generalsettingSlice.actions;
export default generalsettingSlice.reducer;

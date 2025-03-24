import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import InquiryService from "./inquiryService";
import { toast } from "react-toastify";


export const addinqu = createAsyncThunk(
  "inquiry/addinqu",
  async (userData, thunkAPI) => {
    try {
      const response = await InquiryService.addinq(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getinqu = createAsyncThunk(
  "inquiry/getinqu", async (thunkAPI) => {
  try {
    const response = await InquiryService.getinq();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});



export const deleteinqu = createAsyncThunk(
  "inquiry/deleteinqu",
  async (userId, thunkAPI) => {
    try {
      const response = await InquiryService.delinq(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editinqu = createAsyncThunk(
  "inquiry/editinqu",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await InquiryService.editinq(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const InquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    inquiry: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  
  extraReducers: (builder) => {
    builder
      //add 
      .addCase(addinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(addinqu.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })


      .addCase(getinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiry = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getinqu.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall

      //delete
      .addCase(deleteinqu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        // message.success(action.payload?.message);
      })

      .addCase(deleteinqu.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message);
      })
      //update

      .addCase(editinqu.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editinqu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        // message.success(action.payload?.message);
      })

      .addCase(editinqu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // message.error(action.payload?.message);
      });
  },
});


export default InquirySlice.reducer;

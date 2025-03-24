import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotesService from "./notesService";
import { toast } from "react-toastify";
import { message } from "antd";


export const addnotess = createAsyncThunk(
  "notes/addnotess",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await NotesService.addnote(id, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getnotess = createAsyncThunk(
    "notes/getnotess",
  async (id, thunkAPI) => {
    try {
      const response = await NotesService.getnote(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const delnotess = createAsyncThunk(
  "notes/delnotess",
  async (userId, thunkAPI) => {
    try {
      const response = await NotesService.adddelnote(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editnotess = createAsyncThunk(
  "notes/editnotess",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await NotesService.editenote(idd, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const NotesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  
  extraReducers: (builder) => {
    builder
      //add
      .addCase(addnotess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addnotess.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(addnotess.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(getnotess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getnotess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getnotess.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(delnotess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delnotess.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(delnotess.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.response?.message);
      })
      //update
      .addCase(editnotess.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editnotess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(editnotess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.response?.message);
      });
  },
});


export default NotesSlice.reducer;

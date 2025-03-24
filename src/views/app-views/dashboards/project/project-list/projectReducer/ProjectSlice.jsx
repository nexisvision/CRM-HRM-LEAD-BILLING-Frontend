import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "./ProjectService";
import { toast } from "react-toastify";

import { message } from "antd";


export const AddPro = createAsyncThunk(
  "project/AddProject",
  async (userData, thunkAPI) => {
    try {
      const response = await ProjectService.AddProject(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const GetProject = createAsyncThunk(
  "project/GetProject",
  async (thunkAPI) => {
    try {
      const response = await ProjectService.GetProject();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const DeletePro = createAsyncThunk(
  "project/Deleteproject",
  async (userId, thunkAPI) => {
    try {
      const response = await ProjectService.DeletePro(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editpro = createAsyncThunk(
  "project/Editproject",
  async ({ id, values }, thunkAPI) => {
    try {

      const response = await ProjectService.EditPro(id, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Async thunk for updating a user



const ProjectSlice = createSlice({
  name: "Project",
  initialState: {
    Project: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  
  extraReducers: (builder) => {
    builder
      //add
      .addCase(AddPro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddPro.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddPro.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(GetProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Project = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetProject.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })



      .addCase(DeletePro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeletePro.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(DeletePro.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(Editpro.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editpro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(Editpro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});


export default ProjectSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./fileService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

export const fileadd = createAsyncThunk(
  "users/fileadd",
  async ({id,values}, thunkAPI) => {
    try {
      const response = await UserService.addfiless(id,values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const GetProject = createAsyncThunk(
  "emp/GetProject",
  async (thunkAPI) => {
    try {
      const response = await UserService.GetProject();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAllUsers();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getUserById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const DeletePro = createAsyncThunk(
  "users/DeletePro",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeletePro(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editpro = createAsyncThunk(
  "users/Editpro",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.EditPro(id, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
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

const ProjectSlice = createSlice({
  name: "Project",
  initialState: {
    Project: [],
    editItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  reducers: {
    toggleAddModal: (state, action) => {
      state.addModel = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
      state.editItem = {};
    },
    editUserData: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
    },
    handleLogout: (state, action) => {
      state.isAuth = action.payload;
      state.loggedInUser = null;
      localStorage.removeItem("isAuth");
      localStorage.removeItem("USER");
      localStorage.removeItem("TOKEN");
    },
    toggleDetailModal: (state, action) => {
      state.detailItem = action.payload;
      state.detailModal = !state.editModal;
    },
    closeDetailModal: (state, action) => {
      state.detailModal = action.payload;
      state.detailItem = {};
    },
  },
  extraReducers: (builder) => {
    builder
      //add
      .addCase(fileadd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fileadd.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(fileadd.rejected, (state, action) => {
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

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  ProjectSlice.actions;
export default ProjectSlice.reducer;

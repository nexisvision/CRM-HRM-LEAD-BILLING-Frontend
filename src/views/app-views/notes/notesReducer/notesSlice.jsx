import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./notesService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";


export const addnotess = createAsyncThunk(
  "users/addnotess",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await UserService.addnote(id, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getnotess = createAsyncThunk(
  "emp/getnotess",
  async (id, thunkAPI) => {
    try {
      const response = await UserService.getnote(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const delnotess = createAsyncThunk(
  "users/delnotess",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.adddelnote(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editnotess = createAsyncThunk(
  "users/editnotess",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.editelnote(idd, formData);
      return response;
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

const NotesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
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

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  NotesSlice.actions;
export default NotesSlice.reducer;

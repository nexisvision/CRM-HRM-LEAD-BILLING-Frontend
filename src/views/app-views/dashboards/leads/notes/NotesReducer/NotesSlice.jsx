import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./NotesService";
import { toast } from "react-toastify";

export const AddNote = createAsyncThunk(
  "users/AddNote",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.AddNotes(id, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const GetNote = createAsyncThunk("emp/GetNote", async (id, thunkAPI) => {
  try {
    const response = await UserService.getNotes(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

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

export const DeleteNotes = createAsyncThunk(
  "users/DeleteNotes",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeleteNotes(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditeNotes = createAsyncThunk(
  "users/EditeNotes",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.Editnote(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);




const NotesSlice = createSlice({
  name: "Notes",
  initialState: {
    Notes: [],
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
      .addCase(AddNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddNote.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(AddNote.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(GetNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Notes = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetNote.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(DeleteNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteNotes.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(DeleteNotes.rejected, (state, action) => {
        state.isLoading = false;
      })
      //update
      .addCase(EditeNotes.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditeNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
      })
      .addCase(EditeNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  NotesSlice.actions;
export default NotesSlice.reducer;

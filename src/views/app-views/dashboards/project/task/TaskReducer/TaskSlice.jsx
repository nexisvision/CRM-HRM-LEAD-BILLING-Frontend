import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./TaskService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user


export const AddTaskk = createAsyncThunk(
  "users/AddTasks",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.Addtask(id, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const AddTasks = createAsyncThunk(
  "users/AddTasks",
  async ({ id, values }, thunkAPI) => {
    try {
      const response = await UserService.Addtask(id, values);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login

export const GetTasks = createAsyncThunk(
  "emp/GetTasks",
  async (id, thunkAPI) => {
    try {
      const response = await UserService.GetTask(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all users
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

// Async thunk for getting user by id
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

// Async thunk for deleting a user
export const DeleteTasks = createAsyncThunk(
  "users/DeleteTasks",
  async (idd, thunkAPI) => {
    try {
      const response = await UserService.Deletetask(idd);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditTasks = createAsyncThunk(
  "users/EditTasks",
  async ({ idd, values }, thunkAPI) => {
    try {
      const response = await UserService.EditTask(idd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

export const EditTaskss = createAsyncThunk(
  "users/EditTasks",
  async ({ iddd, values }, thunkAPI) => {
    try {
      const response = await UserService.EditTaskss(iddd, values);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);


// Async thunk for updating a user

const initialUser = () => {
  const item = window.localStorage.getItem("USER");
  return item ? JSON.parse(item) : null;
};

const initialIsAuth = () => {
  const item = window.localStorage.getItem("isAuth");
  return item ? JSON.parse(item) : false;
};

const RoleAndPermissionSlice = createSlice({
  name: "Tasks",
  initialState: {
    Tasks: [],
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
      .addCase(AddTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddTasks.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(GetTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Tasks = action?.payload;
        toast.success(action.payload?.message);
      })
      .addCase(GetTasks.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

     
      //delete
      .addCase(DeleteTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(DeleteTasks.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(EditTasks.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })

      .addCase(EditTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

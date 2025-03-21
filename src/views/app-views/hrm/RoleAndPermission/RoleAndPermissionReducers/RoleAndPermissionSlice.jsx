import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./RoleAndPermissionService";
import { toast } from "react-toastify";


export const addNewUser = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.addUser(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const roledata = createAsyncThunk("role/getrole", async (thunkAPI) => {
  try {
    const response = await UserService.RoleData();
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


export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteUser(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  "users/updateusers",
  async (user, thunkAPI) => {
    try {
      const response = await UserService.updateUser(user);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const addRole = createAsyncThunk(
  "users/AddRole",
  async (payload, thunkAPI) => {
    try {
      const response = await UserService.addRole(payload);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getRoles = createAsyncThunk("emp/getRoles", async (thunkAPI) => {
  try {
    const response = await UserService.getRoles();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getAllRoles = createAsyncThunk(
  "users/getAllRoles",
  async (thunkAPI) => {
    try {
      const response = await UserService.getAllRoles();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getRoleById = createAsyncThunk(
  "users/getRoleById",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getRoleById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteRole = createAsyncThunk(
  "users/deleteRole",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.deleteRole(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editRole = createAsyncThunk(
  "users/editRole",
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await UserService.editRole(id, payload);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating Role"
      );
    }
  }
);

// Async thunk for updating a user



const RoleAndPermissionSlice = createSlice({
  name: "role",
  initialState: {
    role: [],
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
      .addCase(addNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(roledata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(roledata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(roledata.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        toast.success(`Users fetched successfully`);
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      //getuserbyid
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.user;
        toast.success(action.payload.message);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(addRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload?.data?.message);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      //getall
      .addCase(getAllRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action.payload;
        toast.success(`Roles fetched successfully`);
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })

      //getuserbyid
      .addCase(getRoleById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailItem = action.payload?.role;
        toast.success(action.payload.message);
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //update
      .addCase(editRole.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.role; // Update the state with the updated employee data
        toast.success(action.payload.message);
      })
      .addCase(editRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

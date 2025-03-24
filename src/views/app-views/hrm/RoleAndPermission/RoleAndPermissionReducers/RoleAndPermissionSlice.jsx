import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RoleAndPermissionService from "./RoleAndPermissionService";
import { toast } from "react-toastify";
import { message } from "antd";




export const roledata = createAsyncThunk("role/getrole", async (thunkAPI) => {
  try {
    const response = await RoleAndPermissionService.RoleData();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});




export const addRole = createAsyncThunk(
  "role/AddRole",
  async (payload, thunkAPI) => {
    try {
      const response = await RoleAndPermissionService.addRole(payload);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getRoles = createAsyncThunk("role/getRoles", async (thunkAPI) => {
  try {
    const response = await RoleAndPermissionService.getRoles();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getAllRoles = createAsyncThunk(
  "role/getAllRoles",
  async (thunkAPI) => {
    try {
      const response = await RoleAndPermissionService.getAllRoles();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getRoleById = createAsyncThunk(
  "role/getRoleById",
  async (userId, thunkAPI) => {
    try {
      const response = await RoleAndPermissionService.getRoleById(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (userId, thunkAPI) => {
    try {
      const response = await RoleAndPermissionService.deleteRole(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editRole = createAsyncThunk(
  "role/editRole",
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await RoleAndPermissionService.editRole(id, payload);
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
  extraReducers: (builder) => {
    builder
      //add
    

      .addCase(roledata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(roledata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action?.payload;
        // message.success(action.payload?.data?.message);
      })
      .addCase(roledata.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })

      .addCase(addRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.data?.message);
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
        // message.success(action.payload?.data?.message);
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
        // message.success(`Roles fetched successfully`);
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
        // toast.success(action.payload.message);
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
      message.success(action.payload?.data?.message);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.data?.message);
      })
      //update
      .addCase(editRole.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload?.role; // Update the state with the updated employee data
        message.success(action.payload?.data?.message);
      })
      .addCase(editRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update employee";
        message.error(action.payload?.data?.message);
      });
  },
});


export default RoleAndPermissionSlice.reducer;

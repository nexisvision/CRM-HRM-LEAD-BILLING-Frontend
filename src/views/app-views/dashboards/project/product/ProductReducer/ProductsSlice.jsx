import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./ProductService";
import { toast } from "react-toastify";

import { message } from "antd";



export const AddProdu = createAsyncThunk(
  "users/AddProdu",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await UserService.AddPro(id, formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const GetProdu = createAsyncThunk(
  "emp/GetProdu",
  async (id, thunkAPI) => {
    try {
      const response = await UserService.GetPro(id);
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


export const DeleteProdu = createAsyncThunk(
  "users/DeleteProdu",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.DeletePro(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditProdu = createAsyncThunk(
  "users/EditProdu",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.EditPro(idd, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);

// Add new thunk for getting all products
export const GetAllProdu = createAsyncThunk(
  "products/GetAllProdu",
  async (_, thunkAPI) => {
    try {
      const response = await UserService.GetAllPro();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Async thunk for updating a user



const ProductsSlice = createSlice({
  name: "Product",
  initialState: {
    Product: [],
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
      .addCase(AddProdu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddProdu.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddProdu.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      .addCase(GetProdu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetProdu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Product = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(GetProdu.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      .addCase(DeleteProdu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteProdu.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(DeleteProdu.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })
      //update
      .addCase(EditProdu.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(EditProdu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
      })
      .addCase(EditProdu.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      // Add cases for GetAllProdu
      .addCase(GetAllProdu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllProdu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Product = action.payload;
        // message.success("Products fetched successfully");
      })
      .addCase(GetAllProdu.rejected, (state, action) => {
        state.isLoading = false;
        // message.error(action.payload?.message || "Failed to fetch products");
      });
  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData } =
  ProductsSlice.actions;
export default ProductsSlice.reducer;

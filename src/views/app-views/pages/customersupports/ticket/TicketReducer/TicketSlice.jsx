import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./TicketService";
import { toast } from "react-toastify";
import { message } from "antd";



export const AddTickets = createAsyncThunk(
  "users/addt",
  async (userData, thunkAPI) => {
    try {
      const response = await UserService.CreateTicket(userData);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const getAllTicket = createAsyncThunk(
  "emp/gett",
  async (loginData, thunkAPI) => {
    try {
      const response = await UserService.GetTicket(loginData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const DeleteTicket = createAsyncThunk(
  "users/DeleteTicketeet",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.Deleteticket(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const Editicket = createAsyncThunk(
  "users/Editicket",
  async ({ idd, formData }, thunkAPI) => {
    try {
      const response = await UserService.Editticket(idd, formData);
      return response; // Return the updated data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating employee"
      );
    }
  }
);



const TicketSlice = createSlice({
  name: "Ticket",
  initialState: {
    Ticket: [],
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
      .addCase(AddTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(AddTickets.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })


      .addCase(getAllTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Ticket = action?.payload;
        toast.success(action.payload?.data?.message);
      })
      .addCase(getAllTicket.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message);
      })


      //delete
      .addCase(DeleteTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        message.success(action.payload?.message);
      })
      .addCase(DeleteTicket.rejected, (state, action) => {
        state.isLoading = false;
        message.error(action.payload?.message);
      })

      //update
      .addCase(Editicket.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(Editicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        message.success(action.payload?.message);
        // Update the state with the updated employee data
      })
      .addCase(Editicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        message.error(action.payload?.message);
      });


  },
});

export const { toggleAddModal, toggleEditModal, handleLogout, editUserData, toggleDetailModal, closeDetailModal } =
  TicketSlice.actions;
export default TicketSlice.reducer;

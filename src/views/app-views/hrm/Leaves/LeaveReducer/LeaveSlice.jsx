import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./LeaveService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { message } from "antd";

// Async thunk for adding user
export const CreateL = createAsyncThunk(
    "users/addUser",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.AddLeave(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for user login


export const GetLeave = createAsyncThunk(
    "leave/getLeave",
    async (thunkAPI) => {
        try {
            const response = await UserService.GetLeavedata();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


// Async thunk for deleting a user
export const DeleteLea = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeleteLeave(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const EditLeave = createAsyncThunk(
    "users/updateEmployee",
    async ({ id, values }, thunkAPI) => {
      try {
        const response = await UserService.EditLeave(id, values);
        return response; // Return the updated data
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
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

const LeaveSlice = createSlice({
    name: "Leave",
    initialState: {
        Leave:[],
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
            state.loggedInUser = null
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
            .addCase(CreateL.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CreateL.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(CreateL.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })

            .addCase(GetLeave.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GetLeave.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Leave = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(GetLeave.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })
           
         
            .addCase(DeleteLea.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteLea.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })

            .addCase(DeleteLea.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })
            //update

            .addCase(EditLeave.pending, (state) => {
                state.isLoading = false;
                state.error = null;
              })
              .addCase(EditLeave.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                message.success(action.payload?.message);
              })
              .addCase(EditLeave.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                message.error(action.payload?.message);
              });
    },
});

export const {
    toggleAddModal,
    toggleEditModal,
    handleLogout,
    editUserData,
} = LeaveSlice.actions;
export default LeaveSlice.reducer;

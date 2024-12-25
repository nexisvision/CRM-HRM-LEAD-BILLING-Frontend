import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./CompanyService";
import { toast } from "react-toastify";
import { navigate } from "react-big-calendar/lib/utils/constants";

// Async thunk for adding user
export const addClient = createAsyncThunk(
    "users/addUser",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.createClient(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for user login


export const ClientData = createAsyncThunk(
    "emp/getEmp",
    async (thunkAPI) => {
        try {
            const response = await UserService.ClientData();
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
export const deleteClient = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeleteClient(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const Editclient = createAsyncThunk(
    "users/updateEmployee",
    async ({ comnyid, values }, thunkAPI) => {
      try {
        const response = await UserService.EditClient(comnyid, values);
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

const RoleAndPermissionSlice = createSlice({
    name: "ClientData",
    initialState: {
        ClientData:[],
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
            .addCase(addClient.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success(action.payload?.data?.message);
            })
            .addCase(addClient.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })

            .addCase(ClientData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ClientData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ClientData = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(ClientData.rejected, (state, action) => {
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
            .addCase(deleteClient.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success(action.payload.message);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.response?.data?.message);
            })
            //update
            .addCase(Editclient.pending, (state) => {
                state.isLoading = false;
                state.error = null;
              })
              .addCase(Editclient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
              })
              .addCase(Editclient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to update employee";
              });
    },
});

export const {
    toggleAddModal,
    toggleEditModal,
    handleLogout,
    editUserData,
} = RoleAndPermissionSlice.actions;
export default RoleAndPermissionSlice.reducer;

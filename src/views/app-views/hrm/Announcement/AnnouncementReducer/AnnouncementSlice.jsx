import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./AnnouncementService";
import { toast } from "react-toastify";
import { message } from "antd";

export const addAnnounce = createAsyncThunk(
    "users/addAnnounce",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.AddAna(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const GetAnn = createAsyncThunk(
    "emp/GetAnn",
    async (thunkAPI) => {
        try {
            const response = await UserService.GetAnnonce();
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

export const DeleteAnn = createAsyncThunk(
    "users/DeleteAnn",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeleteAnn(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const EditDept = createAsyncThunk(
    "users/updateEmployee",
    async ({ comnyid, values }, thunkAPI) => {
        try {
            console.log("idinslice", comnyid)
            const response = await UserService.EditDept(comnyid, values);
            return response; // Return the updated data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
        }
    }
);






const AnnouncementSlice = createSlice({
    name: "Announce",
    initialState: {
        Announce: [],
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
            .addCase(addAnnounce.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAnnounce.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(addAnnounce.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })

            .addCase(GetAnn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GetAnn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Announce = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(GetAnn.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })


            //delete
            .addCase(DeleteAnn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteAnn.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(DeleteAnn.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })
            //update
            .addCase(EditDept.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(EditDept.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                message.success(action.payload?.message);
            })
            .addCase(EditDept.rejected, (state, action) => {
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
} = AnnouncementSlice.actions;
export default AnnouncementSlice.reducer;

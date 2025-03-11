import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./currenciesService";
import { toast } from "react-toastify";

import { message } from "antd";



export const addcurren = createAsyncThunk(
    "users/addcurren",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.addcurr(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const getcurren = createAsyncThunk(
    "leave/getcurr",
    async (thunkAPI) => {
        try {
            const response = await UserService.getcurr();
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


export const deletecurren = createAsyncThunk(
    "users/deletecurren",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.delcurr(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const editscurren = createAsyncThunk(
    "users/editscurren",
    async ({ id, values }, thunkAPI) => {
        try {
            console.log("idinslice", id)
            const response = await UserService.editcurr(id, values);
            return response; // Return the updated data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
        }
    }
);






const currenciesSlice = createSlice({
    name: "currencies",
    initialState: {
        currencies: [],
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
            .addCase(addcurren.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addcurren.fulfilled, (state, action) => {
                state.isLoading = false;
                // message.success(action.payload?.message);
            })

            .addCase(addcurren.rejected, (state, action) => {
                state.isLoading = false;
                // message.error(action.payload?.message);
            })


            .addCase(getcurren.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getcurren.fulfilled, (state, action) => {
                state.currencies = action.payload;
                state.isLoading = false;
                toast.success(action.payload?.message);
            })
            .addCase(getcurren.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })


            // 
            //delete
            .addCase(deletecurren.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletecurren.fulfilled, (state, action) => {
                state.isLoading = false;
                // message.success(action.payload.message);
            })

            .addCase(deletecurren.rejected, (state, action) => {
                state.isLoading = false;
                // message.error(action.payload?.response?.data?.message);
            })
            //update

            .addCase(editscurren.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(editscurren.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                // message.success(action.payload?.message);
            })

            .addCase(editscurren.rejected, (state, action) => {
                state.isLoading = false;
                // state.error = action.payload;
                // message.error(action.payload?.response?.data?.message);
            });
    },
});


export const {
    toggleAddModal,
    toggleEditModal,
    handleLogout,
    editUserData,
} = currenciesSlice.actions;
export default currenciesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./DepartmentService";
import { toast } from "react-toastify";

import { message } from "antd";

export const AddDept = createAsyncThunk(
    "users/addUser",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.AddDepartment(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const getDept = createAsyncThunk(
    "emp/getDept",
    async (thunkAPI) => {
        try {
            const response = await UserService.GetDept();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const DeleteDept = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeleteDept(userId);
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






const DepartmentSlice = createSlice({
    name: "Department",
    initialState: {
        Department: [],
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
            .addCase(AddDept.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddDept.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(AddDept.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })


            .addCase(getDept.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDept.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Department = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(getDept.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })


            .addCase(DeleteDept.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteDept.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(DeleteDept.rejected, (state, action) => {
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
} = DepartmentSlice.actions;
export default DepartmentSlice.reducer;

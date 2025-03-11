import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./DesignationService";
import { toast } from "react-toastify";
import { message } from "antd";


export const AddDes = createAsyncThunk(
    "users/addUser",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.AddDesignation(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const getDes = createAsyncThunk(
    "emp/getEmp",
    async (thunkAPI) => {
        try {
            const response = await UserService.GetDes();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const DeleteDes = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeleteDes(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const EditDes = createAsyncThunk(
    "users/updateEmployee",
    async ({ id, values }, thunkAPI) => {
        try {
            console.log("idinslice", id)
            const response = await UserService.EditDesignation(id, values);
            return response; // Return the updated data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
        }
    }
);






const DesignationSlice = createSlice({
    name: "Designation",
    initialState: {
        Designation: [],
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
            .addCase(AddDes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddDes.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(AddDes.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })


            .addCase(getDes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Designation = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(getDes.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })


            //delete
            .addCase(DeleteDes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteDes.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(DeleteDes.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })
            //update

            .addCase(EditDes.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(EditDes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                message.success(action.payload?.message);
            })

            .addCase(EditDes.rejected, (state, action) => {
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
} = DesignationSlice.actions;
export default DesignationSlice.reducer;

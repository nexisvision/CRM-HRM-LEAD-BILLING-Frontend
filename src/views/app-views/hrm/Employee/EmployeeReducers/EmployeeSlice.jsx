import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./EmployeeService";
import { toast } from "react-toastify";



export const addEmp = createAsyncThunk(
    "users/addUser",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.createEmp(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const empdata = createAsyncThunk(
    "emp/getEmp",
    async (loginData, thunkAPI) => {
        try {
            const response = await UserService.fetchEmpData(loginData);
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


export const deleteEmp = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.Empdelete(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const updateEmp = createAsyncThunk(
    "users/updateEmployee",
    async ({ idd, updatedFormValues }, thunkAPI) => {
        try {
            const response = await UserService.EditEmp(idd, updatedFormValues);
            return response; // Return the updated data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
        }
    }
);






const EmployeeSlice = createSlice({
    name: "employee",
    initialState: {
        employee: [],
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
            .addCase(addEmp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addEmp.fulfilled, (state, action) => {
                state.isLoading = false;
                // message.success(action.payload?.message);
            })

            .addCase(addEmp.rejected, (state, action) => {
                state.isLoading = false;
                // message.error(action.payload?.message);
            })


            .addCase(empdata.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(empdata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.employee = action?.payload;
                toast.success(action.payload?.data?.message);
            })
            .addCase(empdata.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })

            //delete
            .addCase(deleteEmp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEmp.fulfilled, (state, action) => {
                state.isLoading = false;
            })

            .addCase(deleteEmp.rejected, (state, action) => {
                state.isLoading = false;
            })
            //update

            .addCase(updateEmp.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateEmp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload; // Update the state with the updated employee data
                // message.success(action.payload?.message);
            })

            .addCase(updateEmp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                // message.error(action.payload?.message);
            });

    },
});

export const {
    toggleAddModal,
    toggleEditModal,
    handleLogout,
    editUserData,
} = EmployeeSlice.actions;
export default EmployeeSlice.reducer;

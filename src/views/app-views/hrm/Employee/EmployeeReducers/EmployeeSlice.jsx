import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EmployeeService from "./EmployeeService";
import { message } from "antd";




export const addEmp = createAsyncThunk(
    "employee/addEmp",
    async (userData, thunkAPI) => {
        try {
            const response = await EmployeeService.createEmp(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const empdata = createAsyncThunk(
    "employee/getEmp",
    async (loginData, thunkAPI) => {
        try {
            const response = await EmployeeService.fetchEmpData(loginData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getAllUsers = createAsyncThunk(
    "employee/getAllUsers",
    async (thunkAPI) => {
        try {
            const response = await EmployeeService.getAllUsers();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getUserById = createAsyncThunk(
    "employee/getUserById",
    async (userId, thunkAPI) => {
        try {
            const response = await EmployeeService.getUserById(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const deleteEmp = createAsyncThunk(
    "employee/deleteEmp",
    async (userId, thunkAPI) => {
        try {
            const response = await EmployeeService.Empdelete(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const updateEmp = createAsyncThunk(
    "employee/updateEmp",
    async ({ idd, values }, thunkAPI) => {
        console.log("updatedFormValues",values);
        try {
                const response = await EmployeeService.EditEmp(idd, values);
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

            })
            .addCase(empdata.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
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

export default EmployeeSlice.reducer;

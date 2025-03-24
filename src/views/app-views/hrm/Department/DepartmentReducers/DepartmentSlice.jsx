import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DepartmentService from "./DepartmentService";

import { message } from "antd";

export const AddDept = createAsyncThunk(
    "department/addDept",
    async (userData, thunkAPI) => {
        try {
            const response = await DepartmentService.AddDepartment(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const getDept = createAsyncThunk(
    "department/getDept",
    async (thunkAPI) => {
        try {
            const response = await DepartmentService.GetDept();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const DeleteDept = createAsyncThunk(
    "department/deleteDept",
    async (userId, thunkAPI) => {
        try {
            const response = await DepartmentService.DeleteDept(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const EditDept = createAsyncThunk(
    "department/updateDept",
    async ({ comnyid, values }, thunkAPI) => {
        try {
            console.log("idinslice", comnyid)
                const response = await DepartmentService.EditDept(comnyid, values);
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
   
    extraReducers: (builder) => {
        builder
            //add
            .addCase(AddDept.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddDept.fulfilled, (state, action) => {
                state.isLoading = false;
                // message.success(action.payload?.message);
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

            })
            .addCase(getDept.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
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

export default DepartmentSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DesignationService from "./DesignationService";
import { message } from "antd";


export const AddDes = createAsyncThunk(
    "designation/addDes",
    async (userData, thunkAPI) => {
        try {
            const response = await DesignationService.AddDesignation(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getDes = createAsyncThunk(
    "designation/getDes",
    async (thunkAPI) => {
        try {
            const response = await DesignationService.GetDes();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const DeleteDes = createAsyncThunk(
    "designation/deleteDes",
    async (userId, thunkAPI) => {
        try {
            const response = await DesignationService.DeleteDes(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const EditDes = createAsyncThunk(
    "designation/updateDes",
    async ({ id, values }, thunkAPI) => {
        try {
            console.log("idinslice", id)
            const response = await DesignationService.EditDesignation(id, values);
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
    
    extraReducers: (builder) => {
        builder
           
            .addCase(AddDes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddDes.fulfilled, (state, action) => {
                state.isLoading = false;
                
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
            })
            .addCase(getDes.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
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
export default DesignationSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CurrenciesService from "./currenciesService";

import { message } from "antd";



export const addcurren = createAsyncThunk(
    "currencies/addcurren",
    async (userData, thunkAPI) => {
        try {
            const response = await CurrenciesService.addcurr(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const getcurren = createAsyncThunk(
    "currencies/getcurr",
    async (thunkAPI) => {
        try {
            const response = await CurrenciesService.getcurr();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const deletecurren = createAsyncThunk(
    "currencies/deletecurren",
    async (userId, thunkAPI) => {
        try {
            const response = await CurrenciesService.delcurr(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const editscurren = createAsyncThunk(
    "currencies/editscurren",
    async ({ id, values }, thunkAPI) => {
        try {
            const response = await CurrenciesService.editcurr(id, values);
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
    extraReducers: (builder) => {
        builder
            //add
            .addCase(addcurren.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addcurren.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.data?.message);
            })

            .addCase(addcurren.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.data?.message);
            })


            .addCase(getcurren.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getcurren.fulfilled, (state, action) => {
                state.currencies = action.payload;
                state.isLoading = false;
                // message.success(action.payload?.data?.message);
            })
            .addCase(getcurren.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.data?.message);
            })


            // 
            //delete
            .addCase(deletecurren.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletecurren.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.data?.message);
            })

            .addCase(deletecurren.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.data?.message);
            })
            //update

            .addCase(editscurren.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(editscurren.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                message.success(action.payload?.data?.message);
            })

            .addCase(editscurren.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.data?.message);
            });
    },
});



export default currenciesSlice.reducer;

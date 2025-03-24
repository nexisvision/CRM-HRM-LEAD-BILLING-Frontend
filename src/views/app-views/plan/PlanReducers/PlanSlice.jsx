import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PlanService from "./PlanService";
import { toast } from "react-toastify";
import { message } from "antd";


export const planbutus = createAsyncThunk(
    "plan/planbutus",
    async (userData, thunkAPI) => {
        try {
            const response = await PlanService.planbuy(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const CreatePlan = createAsyncThunk(
    "plan/addplan",
    async (userData, thunkAPI) => {
        try {
            const response = await PlanService.AddPlan(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const GetPlan = createAsyncThunk(
    "plan/getplan",
    async (thunkAPI) => {
        try {
            const response = await PlanService.Getplan();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const DeleteP = createAsyncThunk(
    "plan/deleteplan",
    async (userId, thunkAPI) => {
        try {
            const response = await PlanService.DeletePlan(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const Editplan = createAsyncThunk(
    "plan/updatepaln",
    async ({ id, values }, thunkAPI) => {
        try {
            console.log("idinslice", id)
            const response = await PlanService.EditP(id, values);
            return response; // Return the updated data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error updating employee");
        }
    }
);






const PlanSlice = createSlice({
    name: "Plan",
    initialState: {
        Plan: [],
        editItem: {},
        isLoading: false,
        addModel: false,

        editModal: false,
    },
    extraReducers: (builder) => {
        builder

            .addCase(planbutus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(planbutus.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(planbutus.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })


            //add
            .addCase(CreatePlan.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CreatePlan.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(CreatePlan.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            })

            .addCase(GetPlan.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GetPlan.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Plan = action?.payload?.data;
                toast.success(action.payload?.data?.message);

            })
            .addCase(GetPlan.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.message);
            })

            //update
            .addCase(Editplan.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(Editplan.fulfilled, (state, action) => {
                state.isLoading = false;
                state.editItem = action.payload;
                
            })
            .addCase(Editplan.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                message.error(action.payload?.message);
            })
            .addCase(DeleteP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteP.fulfilled, (state, action) => {
                state.isLoading = false;
                message.success(action.payload?.message);
            })
            .addCase(DeleteP.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.payload?.message);
            });

    },
});


export default PlanSlice.reducer;

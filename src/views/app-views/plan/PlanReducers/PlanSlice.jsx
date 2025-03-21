import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./PlanService";
import { toast } from "react-toastify";
import { message } from "antd";


export const planbutus = createAsyncThunk(
    "users/planbutus",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.planbuy(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const CreatePlan = createAsyncThunk(
    "users/addplan",
    async (userData, thunkAPI) => {
        try {
            const response = await UserService.AddPlan(userData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const GetPlan = createAsyncThunk(
    "leave/getLeave",
    async (thunkAPI) => {
        try {
            const response = await UserService.Getplan();
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


export const DeleteP = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            const response = await UserService.DeletePlan(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const Editplan = createAsyncThunk(
    "users/updateEmployee",
    async ({ id, values }, thunkAPI) => {
        try {
            console.log("idinslice", id)
            const response = await UserService.EditP(id, values);
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

export const {
    toggleAddModal,
    toggleEditModal,
    handleLogout,
    editUserData,
} = PlanSlice.actions;
export default PlanSlice.reducer;

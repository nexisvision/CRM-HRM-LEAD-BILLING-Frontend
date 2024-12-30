import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserAddCurrencies from "./currenciesServices";
import { toast } from "react-toastify";
// export const addCurrency = createAsyncThunk(
//     "currencies/AddCurrency",
//     async (data, thunkAPI) => {
//         try {
//             const response = await UserAddCurrencies.AddCurrencies(data);
//             return response;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response.data);
//         }
//     }
// );
export const getallcurrencies = createAsyncThunk(
    "currencies/GetAllCurrencies",
    async (_, thunkAPI) => {
        try {
            const response = await UserAddCurrencies.GetAllCurrencies();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
const currenciesSlice = createSlice({
    name: "currencies",
    initialState: {
        currencies: [],
        message: "",
        isLoading: false,
        addModel: false,
        editModal: false,
    },
    reducers: {
        setSelectedCurrencies: (state, action) => {
            state.selectedCurrencies = action.payload;
        },
        clearCurrenciesState: (state) => {
            state.error = null;
            state.success = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        // .addCase(addCurrency.pending, (state, action) => {
        //     state.isLoading = true;
        // })
        // .addCase(addCurrency.fulfilled, (state, action) => {
        //     state.currencies = action.payload;
        //     state.isLoading = false;
        // })
        // .addCase(addCurrency.rejected, (state, action) => {
        //     state.isLoading = false;
        //     toast.error(action.payload?.message);
        // })
        .addCase(getallcurrencies.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(getallcurrencies.fulfilled, (state, action) => {
            state.currencies = action.payload;
            state.isLoading = false;
        })
        .addCase(getallcurrencies.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload?.message);
        })
    }
});
export const { setSelectedCountries, clearCurrenciesState } = currenciesSlice.actions;
export default currenciesSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserAddCountries from "./countriesService";
import { toast } from "react-toastify";
export const addCountry = createAsyncThunk(
    "countries/AddCountry",
    async (data, thunkAPI) => {
        try {
            const response = await UserAddCountries.AddCountries(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const getallcountries = createAsyncThunk(
    "countries/GetAllCountries",
    async (_, thunkAPI) => {
        try {
            const response = await UserAddCountries.GetAllCountries();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const updatecountries = createAsyncThunk(
    "countries/updateCountries",
    async (_, thunkAPI) => {
        try {
            const response = await UserAddCountries.updateCountries();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
const countriesSlice = createSlice({
    name: "countries",
    initialState: {
        countries: [],
        message: "",
        isLoading: false,
        addModel: false,
        editModal: false,
    },
    reducers: {
        setSelectedCountries: (state, action) => {
            state.selectedCountries = action.payload;
        },
        clearCountriesState: (state) => {
            state.error = null;
            state.success = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addCountry.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(addCountry.fulfilled, (state, action) => {
            state.countries = action.payload;
            state.isLoading = false;
        })
        .addCase(addCountry.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload?.message);
        })
        .addCase(getallcountries.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(getallcountries.fulfilled, (state, action) => {
            state.countries = action.payload;
            state.isLoading = false;
        })
        .addCase(getallcountries.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload?.message);
        })
        .addCase(updatecountries.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updatecountries.fulfilled, (state, action) => {
            state.countries = action.payload;
            state.isLoading = false;
        })
        .addCase(updatecountries.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload?.message);
        })
    }
});
export const { setSelectedCountries, clearCountriesState } = countriesSlice.actions;
export default countriesSlice.reducer;
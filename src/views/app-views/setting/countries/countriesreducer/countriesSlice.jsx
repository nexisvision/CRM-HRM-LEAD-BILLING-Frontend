import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CountriesService from "./countriesService";
import { message } from "antd";
import axios from 'axios';
import { env } from "configs/EnvironmentConfig";

export const addCountry = createAsyncThunk(
    "countries/AddCountry",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${env.API_ENDPOINT_URL}/countries/`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong'
            );
        }
    }
);

export const getallcountries = createAsyncThunk(
    "countries/GetAllCountries",
    async (_, thunkAPI) => {
        try {
            const response = await CountriesService.GetAllCountries();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updatecountries = createAsyncThunk(
    "countries/updateCountries",
    async ({ idd, values }, thunkAPI) => {
        try {
            const response = await CountriesService.updateCountries(idd, values);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const DeletePs = createAsyncThunk(
    "countries/deleteCountry",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await CountriesService.deleteCountries(id);
            dispatch(getallcountries());
            return { id, ...response };
        } catch (error) {
            console.error('Delete Thunk Error:', error);
            return rejectWithValue(error.message || 'Failed to delete country');
        }
    }
);

const countriesSlice = createSlice({
    name: "countries",
    initialState: {
        countries: [],
        editItem: {},
        message: "",
        isLoading: false,
        error: null,
        addModel: false,
        editModal: false,
    },

    extraReducers: (builder) => {
        builder
            .addCase(addCountry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addCountry.fulfilled, (state, action) => {
                state.countries.push(action.payload);
                state.isLoading = false;
                message.success(action.payload?.data?.message);
            })
            .addCase(addCountry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                message.error(action.payload?.data?.message);
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
                message.error(action.payload?.data?.message);
            })
            .addCase(updatecountries.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updatecountries.fulfilled, (state, action) => {
                state.editItem = action.payload.data;
                state.isLoading = false;
                message.success(action.payload?.data?.message);
            })
            .addCase(updatecountries.rejected, (state, action) => {
                state.isLoading = false;
                    message.error(action.payload?.data?.message);
            })
            .addCase(DeletePs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(DeletePs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.countries = state.countries.filter(country => country.id !== action.payload.id);
                message.success(action.payload?.data?.message);
            })


            .addCase(DeletePs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                message.error(action.payload?.data?.message);
            })

    }
});

export default countriesSlice.reducer;
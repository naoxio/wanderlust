import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CountryStatus } from '@interfaces/index'

const initialState: CountryStatus[] = [];


export const fetchCountryStatuses = createAsyncThunk<CountryStatus[], void, object>(
  'countryStatus/fetchCountryStatuses',
  async () => {
    const response = await axios.get<CountryStatus[]>('http://localhost:3000/api/country-statuses');
    return response.data;
  }
);

export const updateCountryStatus = createAsyncThunk(
  'countryStatus/updateCountryStatus',
  async (countryStatus: CountryStatus) => {
    await axios.post('http://localhost:3000/api/country-status', countryStatus);
    return countryStatus;
  }
);


const countryStatusSlice = createSlice({
  name: 'countryStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryStatuses.fulfilled, (_state, action: PayloadAction<CountryStatus[]>) => {
        return action.payload;
      })
      .addCase(updateCountryStatus.fulfilled, (state, action: PayloadAction<CountryStatus>) => {
        const { iso_a2, status } = action.payload;
        const existingCountry = state.find((country) => country.iso_a2 === iso_a2);
        if (existingCountry) {
          existingCountry.status = status;
        } else {
          state.push(action.payload);
        }
      });
  },
});

export default countryStatusSlice.reducer;
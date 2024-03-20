import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '@vercel/edge-config';
import { CountryStatus } from '@interfaces/index';

const initialState: CountryStatus[] = [];

const isSignedIn = (): boolean => {
  // Check if the user is signed in
  // Return true if signed in, false otherwise
  // You can replace this with your own authentication logic
  return false;
};

export const fetchCountryStatuses = createAsyncThunk<CountryStatus[], void, object>(
  'countryStatus/fetchCountryStatuses',
  async () => {
    if (isSignedIn()) {
      // const response = await axios.get<CountryStatus[]>('/api/country-statuses');
      // return response.data;
      return await get<CountryStatus[]>('countryStatuses');
    } else {
      const localStorageData = localStorage.getItem('countryStatuses');
      if (localStorageData) {
        return JSON.parse(localStorageData);
      }
      return [];
    }
  }
);

export const updateCountryStatus = createAsyncThunk(
  'countryStatus/updateCountryStatus',
  async (countryStatus: CountryStatus) => {
    if (isSignedIn()) {
      //await put      // await axios.post('/api/country-status', countryStatus);
      //('countryStatuses', countryStatus);
      return countryStatus;
    } else {
      const localStorageData = localStorage.getItem('countryStatuses');
      let updatedStatuses: CountryStatus[] = [];
      if (localStorageData) {
        updatedStatuses = JSON.parse(localStorageData);
      }
      const existingCountryIndex = updatedStatuses.findIndex(
        (country) => country.iso_a2 === countryStatus.iso_a2
      );
      if (existingCountryIndex !== -1) {
        updatedStatuses[existingCountryIndex] = countryStatus;
      } else {
        updatedStatuses.push(countryStatus);
      }
      localStorage.setItem('countryStatuses', JSON.stringify(updatedStatuses));
      return countryStatus;
    }
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

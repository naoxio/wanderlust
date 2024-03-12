// selectedRegionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const selectedRegionSlice = createSlice({
  name: 'selectedRegion',
  initialState: 'World',
  reducers: {
    setSelectedRegion: (_state, action: PayloadAction<string>) => action.payload,
  },
});

export const { setSelectedRegion } = selectedRegionSlice.actions;

export default selectedRegionSlice.reducer;
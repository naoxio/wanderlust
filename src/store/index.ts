// store.ts
import { configureStore } from '@reduxjs/toolkit';
import countryStatusReducer from '@/store/countryStatusSlice';
import selectedRegionReducer from '@/store/selectedRegionSlice';

const store = configureStore({
  reducer: {
    countryStatus: countryStatusReducer,
    selectedRegion: selectedRegionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

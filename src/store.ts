// store.ts
import { configureStore } from '@reduxjs/toolkit';
import countryStatusReducer from './countryStatusSlice';

const store = configureStore({
  reducer: {
    countryStatus: countryStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

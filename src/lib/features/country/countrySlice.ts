// /lib/features/country/countrySlice.ts
import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { CountryStatus } from "@/interfaces";
import { fetchCountryStatuses, updateCountryStatus } from "./countryAPI";
import { PayloadAction } from "@reduxjs/toolkit";

interface CountrySliceState {
  countryStatuses: CountryStatus[];
  status: "idle" | "loading" | "failed";
}

const initialState: CountrySliceState = {
  countryStatuses: [],
  status: "idle",
};

export const countrySlice = createAppSlice({
  name: "country",
  initialState,
  reducers: (create) => ({
    setCountryStatuses: create.reducer((state, action: PayloadAction<CountryStatus[]>) => {
      state.countryStatuses = action.payload;
    }),
  }),
  selectors: {
    selectCountryStatuses: (country) => country.countryStatuses,
    selectStatus: (country) => country.status,
  },
});

export const { setCountryStatuses } = countrySlice.actions;
export const { selectCountryStatuses, selectStatus } = countrySlice.selectors;

const isLoggedIn = (): boolean => {
  // Replace this with your actual authentication check
  return false;
};

export const fetchCountryStatusesAsync = (): AppThunk => async (dispatch) => {
  try {
    if (isLoggedIn()) {
      const response = await fetchCountryStatuses();
      dispatch(setCountryStatuses(response.data));
    } else {
      const localStorageData = localStorage.getItem("countryStatuses");
      if (localStorageData) {
        const countryStatuses = JSON.parse(localStorageData) as CountryStatus[];
        dispatch(setCountryStatuses(countryStatuses));
      }
    }
  } catch (error) {
    console.error("Error fetching country statuses:", error);
  }
};


  export const updateCountryStatusAsync = (countryStatus: CountryStatus): AppThunk => async (dispatch) => {
    try {
      if (isLoggedIn()) {
        await updateCountryStatus(countryStatus);
        dispatch(fetchCountryStatusesAsync());
      } else {
        const localStorageData = localStorage.getItem("countryStatuses");
        let countryStatuses: CountryStatus[] = [];
        if (localStorageData) {
          countryStatuses = JSON.parse(localStorageData) as CountryStatus[];
        }
  
        const existingCountryIndex = countryStatuses.findIndex((status) => status.iso_a2 === countryStatus.iso_a2);
        if (existingCountryIndex !== -1) {
          if (countryStatus.status === "") {
            countryStatuses.splice(existingCountryIndex, 1);
          } else {
            countryStatuses[existingCountryIndex] = countryStatus;
          }
        } else {
          countryStatuses.push(countryStatus);
        }
  
        localStorage.setItem("countryStatuses", JSON.stringify(countryStatuses));
        dispatch(setCountryStatuses(countryStatuses));
      }
    } catch (error) {
      console.error("Error updating country status:", error);
    }
  };
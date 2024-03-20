// /lib/features/country/countrySlice.ts
import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { CountryStatus } from "@/interfaces";
import { fetchCountryStatuses, updateCountryStatus } from "./countryAPI";

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
    setCountryStatuses: create.reducer((state, action) => {
      console.log(state)
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

export const fetchCountryStatusesAsync = (): AppThunk => async (dispatch) => {
  try {
    const response = await fetchCountryStatuses();
    dispatch(setCountryStatuses(response.data));
  } catch (error) {
    console.error("Error fetching country statuses:", error);
  }
};

export const updateCountryStatusAsync =
  (countryStatus: CountryStatus): AppThunk =>
  async (dispatch) => {
    try {
      await updateCountryStatus(countryStatus);
      dispatch(fetchCountryStatusesAsync());
    } catch (error) {
      console.error("Error updating country status:", error);
    }
  };
  
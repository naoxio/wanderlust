// /lib/features/country/countryAPI.ts
import { CountryStatus } from "../../../interfaces";

export const fetchCountryStatuses = async (): Promise<{ data: CountryStatus[] }> => {
  const response = await fetch("/api/country-statuses", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result: { data: CountryStatus[] } = await response.json();

  return result;
};

export const updateCountryStatus = async (countryStatus: CountryStatus): Promise<{ data: CountryStatus }> => {
  const response = await fetch("/api/country-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(countryStatus),
  });
  const result: { data: CountryStatus } = await response.json();

  return result;
};

// utils/mapUtils.ts
import { CountryData } from '../interfaces/index';
import { saturateColor } from '../utils/colors';
import { COUNTRY_VISITED, COUNTRY_LIVED, COUNTRY_WANT, COUNTRY_DEFAULT } from './colors';

export const getCountryColor = (
  iso_a2: string,
  countryStatus: { iso_a2: string; status: string }[],
  selectedCountry: CountryData | null
) => {
  let color = COUNTRY_DEFAULT;
  const status = Array.isArray(countryStatus) ? countryStatus.find((cs) => cs.iso_a2 === iso_a2)?.status : null;

  if (status === 'been') {
    color = COUNTRY_VISITED;
  } else if (status === 'lived') {
    color = COUNTRY_LIVED;
  } else if (status === 'want') {
    color = COUNTRY_WANT;
  }

  return selectedCountry && getIsoA2(selectedCountry) === iso_a2 ? saturateColor(color) : color;
};

export const getFilteredCountries = (
  countries: CountryData[],
  selectedRegion: string
) =>
  selectedRegion === 'World'
    ? countries
    : countries.filter((country) => country.properties.region_un === selectedRegion);



export const getIsoA2 = (country: CountryData | null) => {
  if (!country) return ''
  return country.properties.iso_a2 === '-99' ? country.properties.postal : country.properties.iso_a2;
};

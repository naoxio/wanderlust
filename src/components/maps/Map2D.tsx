'use client';

import React from 'react';
import { Box } from '@mui/material';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { CountryData } from '@/interfaces/index';
import { getCountryColor, getIsoA2 } from '@/utils/mapUtils';

interface Map2DProps {
  countries: CountryData[];
  selectedRegion: string;
  countryStatus: { iso_a2: string; status: string }[];
  selectedCountry: CountryData | null;
  handleCountryClick: (country: unknown) => void;
}
const Map2D: React.FC<Map2DProps> = ({
  countries,
  selectedRegion,
  countryStatus,
  selectedCountry,
  handleCountryClick,
}) => {
  return (
    <Box
      style={{
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
      }}
    >
      <ComposableMap projection="geoMercator">
        <ZoomableGroup translateExtent={[[-80,-208], [880, 1000]]}>
          <Geographies geography={countries}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  const country = geo as unknown as CountryData;
                  return (
                    selectedRegion === 'World' ||
                    country.properties.region_un === selectedRegion
                  );
                })
                .map((geo, index) => {
                  console.log(geo)
                  const country = geo as unknown as CountryData;
                  console.log(country)
                  const iso_a2 = getIsoA2(country);
                  
                  console.log(iso_a2)
                  return (
                    <Geography
                      key={`${geo.rsmKey}-${index}`}
                      geography={geo}
                      fill={getCountryColor(iso_a2, countryStatus, selectedCountry)}
                      onClick={() => handleCountryClick(country)}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
};

export default Map2D;
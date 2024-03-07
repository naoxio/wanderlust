import React, { useState, useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryData } from './types';
import nightSkyImage from './assets/night-sky.png';
import { Box } from '@mui/material';
import CountryDetails from './CountryDetails';
import './GlobeComponent.css';

const COWBOY_SELECTED = '#FFD700'; // Gold
const COWBOY_VISITED = '#228B22'; // Forest Green
const COWBOY_DEFAULT = '#aaaaaa'; // Default color
const GLOBE_COLOR = '#0077be';
const POLYGON_SIDE_COLOR = '#00AA00'; // Green

const GlobeComponent: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [beenCountries, setBeenCountries] = useState<string[]>([]);
  const [livedCountries, setLivedCountries] = useState<string[]>([]);
  const [wantCountries, setWantCountries] = useState<string[]>([]);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data.features));
  }, []);

  const handleCountryClick = (polygon: any, _event: MouseEvent, _coords: {
    lat: number;
    lng: number;
    altitude: number;
  }) => {
    const country = polygon as CountryData;
    setSelectedCountry(country);
  };

  const handleCountryHover = (_polygon: any, _prevPolygon: any) => {
    if (globeRef.current) {
      globeRef.current.controls().enableZoom = false;
      globeRef.current.controls().autoRotate = false;
    }
  };

  const getCountryColor = (obj: any) => {
    const country = obj as CountryData;
    if (beenCountries.includes(country.__id)) {
      return COWBOY_VISITED;
    }
    return selectedCountry?.__id === country.__id ? COWBOY_SELECTED : COWBOY_DEFAULT;
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <Globe
        ref={globeRef}
        backgroundImageUrl={nightSkyImage}
        lineHoverPrecision={0}
        polygonsData={countries}
        polygonAltitude={0.06}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => POLYGON_SIDE_COLOR}
        polygonStrokeColor={() => '#111'}
        polygonLabel={(obj: any) => {
          const country = obj as CountryData;
          return `
            <b>${country.properties.ADMIN} (${country.properties.ISO_A2})</b>
          `;
        }}
        onPolygonHover={handleCountryHover}
        onPolygonClick={handleCountryClick}
        polygonsTransitionDuration={300}
      />
      {selectedCountry && (
        <CountryDetails
          country={selectedCountry}
          beenCountries={beenCountries}
          setBeenCountries={setBeenCountries}
          livedCountries={livedCountries}
          setLivedCountries={setLivedCountries}
          wantCountries={wantCountries}
          setWantCountries={setWantCountries}
        />
      )}
    </Box>
  );
};

export default GlobeComponent;
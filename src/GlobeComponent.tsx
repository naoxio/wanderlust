import React, { useState, useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryData } from './types';
import nightSkyImage from './assets/night-sky.png';
import { Box } from '@mui/material';
import CountryDetails from './CountryDetails';
import './GlobeComponent.css';

const COUNTRY_VISITED = '#8BC34A'; // Lime Green
const COUNTRY_LIVED = '#FFC107'; // Amber
const COUNTRY_WANT = '#9C27B0'; // Purple
const COUNTRY_DEFAULT = '#F5F5F5'; // Light Gray
const POLYGON_SIDE_COLOR = '#330033';

const GlobeComponent: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [countryStatus, setCountryStatus] = useState<{ [key: string]: string }>({});
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const handleGlobeClick = (event: any) => {
    if (!event.object) {
      setSelectedCountry(null);
    } 
  };

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data.features));
  }, []);

  const handleCountryClick = (polygon: unknown) => {
    const country = polygon as CountryData;
    setSelectedCountry(country);
  };

  const handleCountryHover = () => {
    if (globeRef.current) {
      globeRef.current.controls().enableZoom = false;
      globeRef.current.controls().autoRotate = false;
    }
  };

  const getCountryColor = (obj: unknown) => {
    const country = obj as CountryData;
    let color = COUNTRY_DEFAULT;
    const status = countryStatus[country.__id];
    
    if (status === 'been') {
      color = COUNTRY_VISITED;
    } else if (status === 'lived') {
      color = COUNTRY_LIVED;
    } else if (status === 'want') {
      color = COUNTRY_WANT;
    }
    
    return selectedCountry?.__id === country.__id ? saturateColor(color) : color;
  };

  const saturateColor = (color: string) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const saturatedRgb = `rgba(${Math.round(rgb.r * 0.8)}, ${Math.round(rgb.g * 0.8)}, ${Math.round(rgb.b * 0.8)}, 1)`;
      return saturatedRgb;
    }
    return color;
  };

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  return (
    <Box sx={{
      position: 'fixed',
      height: '100%',
      overflow: 'hidden',
      left: 0,
      top: 0
      }}>
    {selectedCountry && (
      <CountryDetails
        country={selectedCountry}
        countryStatus={countryStatus}
        setCountryStatus={setCountryStatus}
      />
    )}
      <Globe
        ref={globeRef}
        backgroundImageUrl={nightSkyImage}
        lineHoverPrecision={0}
        polygonsData={countries}
        polygonAltitude={0.06}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => POLYGON_SIDE_COLOR}
        polygonStrokeColor={() => '#111'}
        polygonLabel={(obj: unknown) => {
          const country = obj as CountryData;
          return `
            <b>${country.properties.ADMIN} (${country.properties.ISO_A2})</b>
          `;
        }}
        onPolygonHover={handleCountryHover}
        onPolygonClick={handleCountryClick}
        onGlobeClick={handleGlobeClick}
        polygonsTransitionDuration={300}
      />
    </Box>
  );
};

export default GlobeComponent;
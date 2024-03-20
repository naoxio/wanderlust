'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { GlobeMethods } from 'react-globe.gl';
import { CountryData, CountryStatus } from '../interfaces';

import Toolbar from '../components/Toolbar';
import Map2D from '../components/maps/Map2D';
import Map3D from '../components/maps/Map3D';
import CountryDetails from '../components/CountryDetails';

const WorldMapPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [view, setView] = useState<'2D' | '3D'>('2D');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string>('World');
  const [countryStatus, setCountryStatus] = useState<CountryStatus[]>([]);

  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    const fetchCountries = async () => {
      
      try {
        const response = await fetch('/countries.geojson');
        const data = await response.json();
        setCountries(data.features);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching countries geojson:', error);
        setIsLoading(false);
      }
    };

    const fetchCountryStatus = async () => {
      try {
        const response = await fetch('/api/country-statuses');
        const data = await response.json();
        setCountryStatus(data);
      } catch (error) {
        console.error('Error fetching country statuses:', error);
      }
    };

    fetchCountries();
    fetchCountryStatus();
  }, []);

  const handleCountryClick = (country: unknown) => {
    setSelectedCountry(country as CountryData);
  };

  const handleSelectedRegion = async (region: string) => {
    setSelectedRegion(region);
    
    try {
      await fetch('/api/select-region', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region }),
      });
    } catch (error) {
      console.error('Error updating selected region:', error);
    }
  };

  return (
    <div>
      <Toolbar view={view} setView={setView} setSelectedRegion={handleSelectedRegion} selectedRegion={selectedRegion} />
      {selectedCountry && <CountryDetails country={selectedCountry} />}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw'
          }}
        >
          <p>Loading countries geojson...</p>
          <progress value={loadingProgress} max="100" />
        </Box>
      ) : view === '3D' ? (
        <Map3D
          countries={countries}
          selectedRegion={selectedRegion}
          countryStatus={countryStatus}
          selectedCountry={selectedCountry}
          handleCountryClick={handleCountryClick}
          globeRef={globeRef}
        />
      ) : (
        <Map2D
          countries={countries}
          selectedRegion={selectedRegion}
          countryStatus={countryStatus}
          selectedCountry={selectedCountry}
          handleCountryClick={handleCountryClick}
        />
      )}
    </div>
  );
};

export default WorldMapPage;

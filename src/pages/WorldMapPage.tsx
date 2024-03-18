import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { GlobeMethods } from 'react-globe.gl';
import { CountryData } from '@interfaces/index';
import { RootState } from '@store/index';
import { setSelectedRegion } from '@store/selectedRegionSlice';
import { fetchCountryStatuses } from '@store/countryStatusSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import Toolbar from '@components/Toolbar';
import Map2D from '@maps/Map2D';
import Map3D from '@maps/Map3D';
import CountryDetails from '@components/CountryDetails';

const WorldMapPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [view, setView] = useState<'2D' | '3D'>('2D');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const selectedRegion = useAppSelector((state: RootState) => state.selectedRegion);
  const countryStatus = useAppSelector((state: RootState) => state.countryStatus);
  const dispatch = useAppDispatch();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/countries.geojson');
        const reader = response.body?.getReader();
        const contentLength = response.headers.get('Content-Length');
        let receivedLength = 0;

        if (reader && contentLength) {
          const chunks = [];
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            chunks.push(value);
            receivedLength += value.length;
            setLoadingProgress(Math.floor((receivedLength / Number(contentLength)) * 100));
          }
          const chunksAll = new Uint8Array(receivedLength);
          let position = 0;
          for (const chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
          }
          const result = new TextDecoder('utf-8').decode(chunksAll);
          const data = JSON.parse(result);
          setCountries(data.features);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching countries geojson:', error);
        setIsLoading(false);
      }
    };

    fetchCountries();
    dispatch(fetchCountryStatuses());
  }, [dispatch]);

  const handleCountryClick = (country: unknown) => {
    setSelectedCountry(country as CountryData);
  };

  return (
    <div>
      <Toolbar
        selectedRegion={selectedRegion}
        setSelectedRegion={(region) => dispatch(setSelectedRegion(region))}
        view={view}
        setView={setView}
      />
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
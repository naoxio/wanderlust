import React, { useState, useEffect, useRef } from 'react';
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
  const selectedRegion = useAppSelector((state: RootState) => state.selectedRegion);
  const countryStatus = useAppSelector((state: RootState) => state.countryStatus);
  const dispatch = useAppDispatch()
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data.features));

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
      {view === '3D' ? (
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
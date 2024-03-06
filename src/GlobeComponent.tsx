import React, { useState, useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryData, VisitedCountry } from './types';
import { calculateTotalLength } from './utils';
import earthNightImage from './assets/earth-night.jpg';
import nightSkyImage from './assets/night-sky.png';
import './GlobeComponent.css';

const COWBOY_SELECTED = '#FFD700'; // Gold
const COWBOY_VISITED = '#228B22'; // Forest Green
const COWBOY_DEFAULT = '#aaaaaa'; // Default color

const GlobeComponent: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [visitedCountries, setVisitedCountries] = useState<VisitedCountry[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
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

  const handleVisitSubmit = (from: string, to: string) => {
    if (selectedCountry) {
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (fromDate <= toDate) {
          const countryId = selectedCountry.__id;
          setVisitedCountries((prevVisited) => {
            const existingCountry = prevVisited.find((c) => c.id === countryId);
            if (existingCountry) {
              const updatedPeriods = [...existingCountry.periods, { from, to }];
              const updatedTotalLength = calculateTotalLength(updatedPeriods);
              return prevVisited.map((c) =>
                c.id === countryId ? { ...c, periods: updatedPeriods, totalLength: updatedTotalLength } : c
              );
            } else {
              const newPeriod = { from, to };
              const newTotalLength = calculateTotalLength([newPeriod]);
              return [...prevVisited, { id: countryId, periods: [newPeriod], totalLength: newTotalLength }];
            }
          });
          setDateError(null);
        } else {
          setDateError('Invalid date range. "From" date must be earlier than or equal to "To" date.');
        }
      } else {
        setDateError('Please enter both "From" and "To" dates.');
      }
    }
  };
  const getCountryColor = (obj: any) => {
    const country = obj as CountryData
    const getCountryColor = (obj: any) => {
      const country = obj as CountryData;
      const visitedCountry = visitedCountries.find((c) => c.id === country.__id);
      if (visitedCountry) {
        return 'var(--cowboy-visited)';
      }
      return selectedCountry?.__id === country.__id ? 'var(--cowboy-selected)' : 'rgba(255, 255, 255, 0.7)';
    };
  ;
    const visitedCountry = visitedCountries.find((c) => c.id === country.__id);
    if (visitedCountry) {
      return COWBOY_VISITED;
    }
    return selectedCountry?.__id === country.__id ? COWBOY_SELECTED : COWBOY_DEFAULT;
  };

  return (
    <div className="globe-container">
      <Globe
        ref={globeRef}
        globeImageUrl={earthNightImage}
        backgroundImageUrl={nightSkyImage}
        lineHoverPrecision={0}
        polygonsData={countries}
        polygonAltitude={0.06}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
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
        <div>
          <h3 className="selected-country">Selected Country: {selectedCountry.properties.ADMIN}</h3>
          {dateError && <p className="error-message">{dateError}</p>}
          <input type="date" id="fromDate" className="input-field" />
          <input type="date" id="toDate" className="input-field" />
          <button
            className="submit-button"
            onClick={() => {
              const fromDate = (document.getElementById('fromDate') as HTMLInputElement).value;
              const toDate = (document.getElementById('toDate') as HTMLInputElement).value;
              handleVisitSubmit(fromDate, toDate);
            }}
          >
            Add Visit
          </button>
        
          {visitedCountries.find((c) => c.id === selectedCountry.__id) && (
            <div>
              <h4 className="visited-periods">Visited Periods:</h4>
              <ul>
                {visitedCountries
                  .find((c) => c.id === selectedCountry.__id)
                  ?.periods.map((period, index) => (
                    <li key={index}>
                      From: {period.from} - To: {period.to}
                    </li>
                  ))}
              </ul>
              <p className="total-length">
                Total Length of Stay:{' '}
                {visitedCountries.find((c) => c.id === selectedCountry.__id)?.totalLength} days
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
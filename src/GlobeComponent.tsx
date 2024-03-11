import React, { useState, useEffect, useRef, useContext } from 'react';
import { MeshPhongMaterial, Color } from 'three';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryData } from './types';
import nightSkyImage from './assets/night-sky.png';
import CountryDetails from './CountryDetails';
import { CountryStatusContext } from './CountryStatusContext';
import { saturateColor, getIsoA2 } from './utils';


const COUNTRY_VISITED = '#8BC34A'; // Lime Green
const COUNTRY_LIVED = '#FFC107'; // Amber
const COUNTRY_WANT = '#9C27B0'; // Purple
const COUNTRY_DEFAULT = '#F5F5F5'; // Light Gray
const GLOBE_COLOR = '#0B3954';
const POLYGON_SIDE_COLOR = '#091732';

const GlobeComponent: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const { countryStatus } = useContext(CountryStatusContext);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const globeMaterial = new MeshPhongMaterial();
  globeMaterial.color = new Color(GLOBE_COLOR);

  const handleGlobeClick = (_coords: { lat: number; lng: number; }, event: MouseEvent & { object?: unknown }) => {
    if (!event.object) {
      setSelectedCountry(null);
    } 
  };
  const handleZoom = (event: WheelEvent) => {
    if (globeRef.current) {
      const globe = globeRef.current;
      const deltaY = event.deltaY;
  
      const pov = globe.pointOfView();
      const altitude = pov.altitude * (1 + (deltaY < 0 ? -0.1 : 0.1));
      globe.pointOfView({ lat: pov.lat, lng: pov.lng, altitude });
    }
  };

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data.features));
    const globeElement = globeRef.current?.renderer().domElement;
    globeElement?.addEventListener('wheel', handleZoom);
  
    return () => {
      globeElement?.removeEventListener('wheel', handleZoom);
    };
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
    const status = countryStatus[getIsoA2(country)];

    if (status === 'been') {
      color = COUNTRY_VISITED;
    } else if (status === 'lived') {
      color = COUNTRY_LIVED;
    } else if (status === 'want') {
      color = COUNTRY_WANT;
    }

    return getIsoA2(selectedCountry) === getIsoA2(country) ? saturateColor(color) : color;
  };


  return (
    <div>
    {selectedCountry && (
      <CountryDetails
        country={selectedCountry}
      />
    )}
      <Globe
        ref={globeRef}
        globeMaterial={globeMaterial}
        backgroundImageUrl={nightSkyImage}
        lineHoverPrecision={0}
        polygonsData={countries}
        polygonAltitude={0.06}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => POLYGON_SIDE_COLOR}
        polygonStrokeColor={() => '#333'}
        polygonLabel={(obj: unknown) => {
          const country = obj as CountryData;
          return `
            <b>${country.properties.admin} (${getIsoA2(country)})</b>
          `;
        }}
        onPolygonHover={handleCountryHover}
        onPolygonClick={handleCountryClick}
        onGlobeClick={handleGlobeClick}
        polygonsTransitionDuration={300}
      />
    </div>
  );
};

export default GlobeComponent;
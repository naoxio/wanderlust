import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MeshPhongMaterial, Color } from 'three';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryData } from './types';
import nightSkyImage from './assets/night-sky.png';
import CountryDetails from './CountryDetails';
import { saturateColor, getIsoA2 } from './utils';
import { RootState } from './store';

const COUNTRY_VISITED = '#8BC34A';
const COUNTRY_LIVED = '#FFC107';
const COUNTRY_WANT = '#9C27B0';
const COUNTRY_DEFAULT = '#F5F5F5';
const GLOBE_COLOR = '#0B3954';
const POLYGON_SIDE_COLOR = '#091732';

const GlobeComponent: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('World');
  const countryStatus = useSelector((state: RootState) => state.countryStatus);
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
      .then((data) => {
        const regions: { [key: string]: CountryData[] } = {};
        data.features.forEach((feature: CountryData) => {
          const region = feature.properties.region_un;
          if (!regions[region]) {
            regions[region] = [];
          }
          regions[region].push(feature);
        });
        setCountries(data.features);
        console.log(regions);
      });

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
    const iso_a2 = getIsoA2(country);
    let color = COUNTRY_DEFAULT;

    const status = countryStatus.find((cs) => cs.iso_a2 === iso_a2)?.status;

    if (status === 'been') {
      color = COUNTRY_VISITED;
    } else if (status === 'lived') {
      color = COUNTRY_LIVED;
    } else if (status === 'want') {
      color = COUNTRY_WANT;
    }

    return getIsoA2(selectedCountry) === getIsoA2(country) ? saturateColor(color) : color;
  };

  const filteredCountries = selectedRegion === 'World'
    ? countries
    : countries.filter((country) => country.properties.region_un === selectedRegion);

  return (
    <div>
      {selectedCountry && <CountryDetails country={selectedCountry} />}
      <Globe
        ref={globeRef}
        globeMaterial={globeMaterial}
        backgroundImageUrl={nightSkyImage}
        lineHoverPrecision={0}
        polygonsData={filteredCountries}
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
      <div>
        <button onClick={() => setSelectedRegion('World')}>World</button>
        <button onClick={() => setSelectedRegion('Africa')}>Africa</button>
        <button onClick={() => setSelectedRegion('Antarctica')}>Antarctica</button>
        <button onClick={() => setSelectedRegion('Asia')}>Asia</button>
        <button onClick={() => setSelectedRegion('Europe')}>Europe</button>
        <button onClick={() => setSelectedRegion('Americas')}>Americas</button>
        <button onClick={() => setSelectedRegion('Oceania')}>Oceania</button>
      </div>
    </div>
  );
};

export default GlobeComponent;
// src/lib/map_renderer.ts
import type { Country, Geometry } from './models';

export function renderMap(countries: Country[], selectedCountry: Country | null, handleCountrySelection: (countryName: string) => void): string {
  const pathCache = new Map<string, string>();
  countries.forEach(country => {
    const path = country.geometry.type === 'Polygon'
      ? coordinatesToPath(country.geometry.coordinates)
      : country.geometry.coordinates.map(poly => coordinatesToPath(poly)).join(" ");
    pathCache.set(country.name, path);
  });

  return `
    <svg width="100%" height="100%" viewBox="-180 -90 360 180">
      ${countries.map(country => renderCountry(country, pathCache, selectedCountry, handleCountrySelection)).join('')}
    </svg>
  `;
}

function renderCountry(country: Country, pathCache: Map<string, string>, selectedCountry: Country | null, handleCountrySelection: (countryName: string) => void): string {
  const path = pathCache.get(country.name) || '';
  const isSelected = selectedCountry?.name === country.name;
  const fillColor = {
    'Been': '#4CAF50', // Green
    'Want': '#FFC107', // Yellow
    'Lived': '#2196F3', // Blue
    'None': '#E0E0E0'  // Light Gray
  }[country.visitStatus];

  return `
    <path
      class="country ${isSelected ? 'selected' : ''}"
      d="${path}"
      fill="${fillColor}"
      onclick="(${handleCountrySelection.toString()})('${country.name}')"
    >
      <title>${country.name}</title>
    </path>
  `;
}

function coordinatesToPath(coordinates: number[][][]): string {
  return coordinates.map(poly => {
    let path = '';
    poly.forEach(([x, y], j) => {
      path += j === 0 ? `M ${x} ${-y} ` : `L ${x} ${-y} `;
    });
    return path + 'Z';
  }).join(" ");
}
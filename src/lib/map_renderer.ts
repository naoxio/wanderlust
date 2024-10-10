// src/lib/map_renderer.ts
import type { Country, Geometry } from './models';

export function renderMap(countries: Country[], selectedCountry: Country | null): string {
  const pathCache = new Map<string, string>();
  countries.forEach(country => {
    const path = country.geometry.type === 'Polygon'
      ? coordinatesToPath(country.geometry.coordinates)
      : country.geometry.coordinates.map(poly => coordinatesToPath(poly)).join(" ");
    pathCache.set(country.name, path);
  });

  return `
    <svg width="100%" height="100%" viewBox="-180 -90 360 180">
      ${countries.map(country => renderCountry(country, pathCache, selectedCountry)).join('')}
    </svg>
  `;
}

function renderCountry(country: Country, pathCache: Map<string, string>, selectedCountry: Country | null): string {
  const path = pathCache.get(country.name) || '';
  const isSelected = selectedCountry?.name === country.name;
  const fillColor = {
    'Been': 'green',
    'Want': 'yellow',
    'Lived': 'blue',
    'None': 'gray'
  }[country.visitStatus];

  return `
    <path
      class="${isSelected ? 'selected' : ''}"
      d="${path}"
      fill="${fillColor}"
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
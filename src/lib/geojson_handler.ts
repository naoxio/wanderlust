// src/lib/geojson_handler.ts
import type { Country, Geometry, VisitStatus, GeoJSON, GeoJSONFeature } from './models';

export async function loadAndParseGeojson(): Promise<Country[]> {
  const response = await fetch('/countries.geojson');
  const geojson: GeoJSON = await response.json();
  return parseGeojson(geojson);
}

function parseGeojson(geojson: GeoJSON): Country[] {
  const features = geojson.features || [];
  console.log(`Total features: ${features.length}`);

  return features.map((feature: GeoJSONFeature) => {
    const properties = feature.properties;
    const geometry = feature.geometry;

    if (!properties || !geometry) {
      console.warn("Feature without properties or geometry found");
      return null;
    }

    const { name, formal_en, iso_a2, iso_a3, iso_n3, region_un, subregion, pop_est } = properties;

    if (!name || !iso_a2 || !iso_a3 || !iso_n3 || !region_un || !subregion || pop_est == null) {
      console.warn(`Incomplete data for country: ${name || 'Unknown'}`);
      return null;
    }

    let parsedGeometry: Geometry;

    if (geometry.type === "Polygon") {
      parsedGeometry = {
        type: "Polygon",
        coordinates: parseCoordinates(geometry.coordinates as number[][][])
      };
    } else if (geometry.type === "MultiPolygon") {
      parsedGeometry = {
        type: "MultiPolygon",
        coordinates: (geometry.coordinates as number[][][][]).map(poly => parseCoordinates(poly))
      };
    } else {
      console.warn(`Unsupported geometry type for country: ${name}`);
      return null;
    }

    console.log(`Parsed country: ${name}`);

    return {
      name,
      formalName: formal_en || '',
      alpha2Code: iso_a2,
      alpha3Code: iso_a3,
      numericCode: iso_n3,
      region: region_un,
      subregion,
      population: pop_est,
      geometry: parsedGeometry,
      visitStatus: 'None' as VisitStatus
    };
  }).filter((country): country is Country => country !== null);
}

function parseCoordinates(coords: number[][][]): number[][][] {
  return coords.map(poly =>
    poly.map((coord: number[]) => [coord[0], coord[1]])
  );
}
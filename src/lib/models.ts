// src/lib/models.ts
export type VisitStatus = 'None' | 'Been' | 'Want' | 'Lived';

export interface Country {
  name: string;
  formalName: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
  region: string;
  subregion: string;
  population: number;
  geometry: Geometry;
  visitStatus: VisitStatus;
}

export type Geometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };

export interface SelectedCountry {
  name: string | null;
}

export interface GeoJSONFeature {
  properties: {
    name: string;
    formal_en?: string;
    iso_a2: string;
    iso_a3: string;
    iso_n3: string;
    region_un: string;
    subregion: string;
    pop_est: number;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSON {
  features: GeoJSONFeature[];
}
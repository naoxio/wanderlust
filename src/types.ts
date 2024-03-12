export interface CountryData {
  __id: string;
  properties: {
    admin: string;
    iso_a2: string;
  };
}

export interface VisitedCountry {
  id: string;
  periods: { from: string; to: string }[];
  totalLength: number;
}


export interface CountryStatus {
  iso_a2: string;
  status: string;
}


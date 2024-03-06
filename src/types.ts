export interface CountryData {
  __id: string;
  properties: {
    ADMIN: string;
    ISO_A2: string;
  };
}

export interface VisitedCountry {
  id: string;
  periods: { from: string; to: string }[];
  totalLength: number;
}

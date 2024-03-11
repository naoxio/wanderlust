import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface CountryStatus {
  [key: string]: string;
}

interface CountryStatusContextProps {
  countryStatus: CountryStatus;
  setCountryStatus: React.Dispatch<React.SetStateAction<CountryStatus>>;
}

export const CountryStatusContext = createContext<CountryStatusContextProps>({
  countryStatus: {},
  setCountryStatus: () => {},
});

interface CountryStatusProviderProps {
  children: ReactNode;
}

export const CountryStatusProvider: React.FC<CountryStatusProviderProps> = ({ children }) => {
  const [countryStatus, setCountryStatus] = useState<CountryStatus>(() => {
    const savedStatus = localStorage.getItem('countryStatus');
    console.log('Saved status from local storage:', savedStatus);

    if (savedStatus) {
      try {
        const parsedStatus = JSON.parse(savedStatus);
        console.log('Parsed status:', parsedStatus);
        return parsedStatus;
      } catch (error) {
        console.error('Error parsing saved status:', error);
      }
    } else {
      console.log('No saved status found in local storage');
    }

    return {};
  });

  useEffect(() => {
    console.log('Country status updated:', countryStatus);
    localStorage.setItem('countryStatus', JSON.stringify(countryStatus));
  }, [countryStatus]);

  return (
    <CountryStatusContext.Provider value={{ countryStatus, setCountryStatus }}>
      {children}
    </CountryStatusContext.Provider>
  );
};
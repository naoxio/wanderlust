import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from './AccountContext';
import { CountryStatus } from '@/interfaces';

const CountryStatusContext = createContext<CountryStatus[]>([]);
const CountryStatusProvider: React.FC = ({ children }) => {
  const [countryStatus, setCountryStatus] = useState<CountryStatus[]>([]);
  const { isLoggedIn } = useAccount(); // Assuming isLoggedIn is a state from AccountContext

  useEffect(() => {
    const fetchCountryStatus = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch('/api/country-statuses');
          const data = await response.json();
          setCountryStatus(data);
          localStorage.setItem('countryStatuses', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching country statuses:', error);
        }
      } else {
        const localStorageData = localStorage.getItem('countryStatuses');
        if (localStorageData) {
          setCountryStatus(JSON.parse(localStorageData));
        }
      }
    };

    fetchCountryStatus();
  }, [isLoggedIn]);

  return (
    <CountryStatusContext.Provider value={[countryStatus, setCountryStatus]}>
      {children}
    </CountryStatusContext.Provider>
  );
};

const useCountryStatus = () => useContext(CountryStatusContext);

export { CountryStatusProvider, useCountryStatus };

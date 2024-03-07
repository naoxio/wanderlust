import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CountryData } from './types';

interface CountryDetailsProps {
  country: CountryData;
  countryStatus: { [key: string]: string };
  setCountryStatus: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({
  country,
  countryStatus,
  setCountryStatus,
}) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value;
    setCountryStatus((prevStatus) => ({
      ...prevStatus,
      [country.__id]: status,
    }));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 60,
        left: 0,
        right: 0,
        bgcolor: 'background.paper', // Use the theme's background color for paper
        color: 'text.primary',
        p: 2,
        transition: 'bottom 0.3s ease',
        zIndex: 1,
      }}
    >
      <Typography variant="h6">{country.properties.ADMIN}</Typography>
      <RadioGroup
        row
        value={countryStatus[country.__id] || ''}
        onChange={handleStatusChange}
      >
        <FormControlLabel value="been" control={<Radio />} label="Been" />
        <FormControlLabel value="lived" control={<Radio />} label="Lived" />
        <FormControlLabel value="want" control={<Radio />} label="Want" />
        <FormControlLabel value="" control={<Radio />} label="None" />
      </RadioGroup>
    </Box>
  );
};

export default CountryDetails;
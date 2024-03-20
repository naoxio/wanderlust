'use client';

import React, { useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CountryData } from '../interfaces/index';
import { getIsoA2 } from '../utils/mapUtils';
import Image from 'next/image';

interface CountryDetailsProps {
  country: CountryData;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country }) => {
  const isoA2 = getIsoA2(country);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value;
    const isoA2 = getIsoA2(country);
  
    console.log(isoA2)
    if (isSignedIn) {
      // Update status in KV if logged in
      await fetch('/api/update-country-status', {
        method: 'POST',
        body: JSON.stringify({ iso_a2: isoA2, status: status }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Update status in localStorage if logged out
      const localStorageData = localStorage.getItem('countryStatuses');
      let updatedStatuses: { iso_a2: string; status: string }[] = [];
      if (localStorageData) {
        updatedStatuses = JSON.parse(localStorageData);
      }
      const existingCountryIndex = updatedStatuses.findIndex(
        (country) => country.iso_a2 === isoA2
      );
      if (existingCountryIndex !== -1) {
        updatedStatuses[existingCountryIndex].status = status;
      } else {
        updatedStatuses.push({ iso_a2: isoA2, status: status });
      }
      localStorage.setItem('countryStatuses', JSON.stringify(updatedStatuses));
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        margin: 'auto',
        top: 60,
        left: 0,
        right: 0,
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 2,
        transition: 'bottom 0.3s ease',
        zIndex: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Image
          width={32}
          height={32}
          src={`/flags/${isoA2.toLowerCase()}.svg`}
          alt={`${country.properties.admin} Flag`}
          style={{ width: 24, height: 24, marginRight: 1 }}
          />
        <Typography variant="h6">{country.properties.admin}</Typography>
      </Box>

      <RadioGroup
        row
        value={''} // Set value based on country status
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

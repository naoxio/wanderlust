'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CountryData } from '../interfaces/index';
import { getIsoA2 } from '../utils/mapUtils';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateCountryStatusAsync, selectCountryStatuses } from '@/lib/features/country/countrySlice';

interface CountryDetailsProps {
  country: CountryData;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country }) => {
  const dispatch = useAppDispatch();
  const countryStatuses = useAppSelector(selectCountryStatuses);
  const isoA2 = getIsoA2(country);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const existingCountry = countryStatuses.find((status) => status.iso_a2 === isoA2);
    setSelectedStatus(existingCountry?.status || '');
  }, [countryStatuses, isoA2]);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    dispatch(updateCountryStatusAsync({ iso_a2: isoA2, status: status }));
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
      <RadioGroup row value={selectedStatus} onChange={handleStatusChange}>
        <FormControlLabel value="been" control={<Radio />} label="Been" />
        <FormControlLabel value="lived" control={<Radio />} label="Lived" />
        <FormControlLabel value="want" control={<Radio />} label="Want" />
        <FormControlLabel value="" control={<Radio />} label="None" />
      </RadioGroup>
    </Box>
  );
};

export default CountryDetails;
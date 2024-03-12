import React, { useEffect } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CountryData } from '@interfaces/index';
import { RootState } from '@store/index';
import { fetchCountryStatuses, updateCountryStatus } from '@store/countryStatusSlice';
import { getIsoA2 } from '@utils/mapUtils';
import { useAppDispatch, useAppSelector } from '../hooks';


interface CountryDetailsProps {
  country: CountryData;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country }) => {
  const dispatch = useAppDispatch()
  const countryStatus = useAppSelector((state: RootState) => state.countryStatus);
  const isoA2 = getIsoA2(country);

  useEffect(() => {
    dispatch(fetchCountryStatuses());
  }, [dispatch]);


  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value;
    dispatch(updateCountryStatus({ iso_a2: getIsoA2(country), status }));
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
        <Box
          component="img"
          src={`/flags/${isoA2.toLowerCase()}.svg`}
          alt={`${country.properties.admin} Flag`}
          sx={{ width: 24, height: 24, mr: 1 }}
        />
        <Typography variant="h6">{country.properties.admin}</Typography>
      </Box>
      <RadioGroup
        row
        value={ countryStatus.find((cs) => cs.iso_a2 === isoA2)?.status || ''}
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
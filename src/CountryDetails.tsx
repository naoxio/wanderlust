import React from 'react';
import { Box, Typography, Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CountryData } from './types';

interface CountryDetailsProps {
  country: CountryData;
  beenCountries: string[];
  setBeenCountries: React.Dispatch<React.SetStateAction<string[]>>;
  livedCountries: string[];
  setLivedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  wantCountries: string[];
  setWantCountries: React.Dispatch<React.SetStateAction<string[]>>;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({
  country,
  beenCountries,
  setBeenCountries,
  livedCountries,
  setLivedCountries,
  wantCountries,
  setWantCountries,
}) => {
  const handleBeenChange = (checked: boolean) => {
    if (checked) {
      setBeenCountries([...beenCountries, country.__id]);
    } else {
      setBeenCountries(beenCountries.filter((id) => id !== country.__id));
    }
  };

  const handleLivedChange = (checked: boolean) => {
    if (checked) {
      setLivedCountries([...livedCountries, country.__id]);
    } else {
      setLivedCountries(livedCountries.filter((id) => id !== country.__id));
    }
  };

  const handleWantChange = (checked: boolean) => {
    if (checked) {
      setWantCountries([...wantCountries, country.__id]);
    } else {
      setWantCountries(wantCountries.filter((id) => id !== country.__id));
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: country ? 0 : '-100%',
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        color: 'text.primary',
        p: 2,
        transition: 'bottom 0.3s ease',
        zIndex: 1,
      }}
    >
      <Typography variant="h6">{country.properties.ADMIN}</Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={beenCountries.includes(country.__id)}
              onChange={(e) => handleBeenChange(e.target.checked)}
            />
          </ListItemIcon>
          <ListItemText primary="Been" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={livedCountries.includes(country.__id)}
              onChange={(e) => handleLivedChange(e.target.checked)}
            />
          </ListItemIcon>
          <ListItemText primary="Lived" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={wantCountries.includes(country.__id)}
              onChange={(e) => handleWantChange(e.target.checked)}
            />
          </ListItemIcon>
          <ListItemText primary="Want" />
        </ListItem>
      </List>
    </Box>
  );
};

export default CountryDetails;

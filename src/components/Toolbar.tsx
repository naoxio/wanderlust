import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ToolbarProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  view: '2D' | '3D';
  setView: (view: '2D' | '3D') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedRegion, setSelectedRegion, view, setView }) => {
  return (
    <AppBar position="fixed">
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Wanderlust
        </Typography>
        <ToggleButtonGroup
          value={selectedRegion}
          exclusive
          onChange={(_, region) => setSelectedRegion(region)}
        >
          <ToggleButton value="World">World</ToggleButton>
          <ToggleButton value="Africa">Africa</ToggleButton>
          <ToggleButton value="Antarctica">Antarctica</ToggleButton>
          <ToggleButton value="Asia">Asia</ToggleButton>
          <ToggleButton value="Europe">Europe</ToggleButton>
          <ToggleButton value="Americas">Americas</ToggleButton>
          <ToggleButton value="Oceania">Oceania</ToggleButton>
        </ToggleButtonGroup>
        <span>&nbsp;&nbsp;</span>
        <ToggleButton
          value={view}
          onClick={() => setView(view === '2D' ? '3D' : '2D')}
        >
          Switch to {view === '2D' ? '3D' : '2D'}
        </ToggleButton>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
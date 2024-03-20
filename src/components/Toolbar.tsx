'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar as MuiToolbar, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsModal from './SettingsModal';
import { TelegramLoginButton } from "react-social-login-buttons";

interface ToolbarProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  view: '2D' | '3D';
  setView: (view: '2D' | '3D') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedRegion, setSelectedRegion, view, setView }) => {
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  return (
    <AppBar position="fixed">
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Traveltint
        </Typography>
        <Box>
          <TelegramLoginButton onClick={() => alert("not yet implemented")} />
        </Box>
        <IconButton color="inherit" onClick={handleOpenSettings}>
          <SettingsIcon />
        </IconButton>
        <SettingsModal
          open={openSettings}
          onClose={handleCloseSettings}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          view={view}
          setView={setView}
        />
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;

'use client';

import React from 'react';
import { Modal, Box, Typography, Select, MenuItem, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  view: '2D' | '3D';
  setView: (view: '2D' | '3D') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, selectedRegion, setSelectedRegion, view, setView }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal"
      aria-describedby="settings-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 300,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" id="settings-modal">
            Settings
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
    
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>Select Visible Region:</Typography>
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as string)}
            defaultValue="World"
          >
            <MenuItem value="World">World</MenuItem>
            <MenuItem value="Africa">Africa</MenuItem>
            <MenuItem value="Antarctica">Antarctica</MenuItem>
            <MenuItem value="Asia">Asia</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Americas">Americas</MenuItem>
            <MenuItem value="Oceania">Oceania</MenuItem>
          </Select>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>Select View Mode:</Typography>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={() => setView(view === '2D' ? '3D' : '2D')}
        >
          <ToggleButton value="2D">2D</ToggleButton>
          <ToggleButton value="3D">3D</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Modal>
  );
};

export default SettingsModal;

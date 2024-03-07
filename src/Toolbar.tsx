import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Typography } from '@mui/material';

const Toolbar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Wanderlust
        </Typography>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;

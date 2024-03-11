import React from 'react';
import { ThemeProvider } from '@mui/material';
import darkTheme from './theme';
import Toolbar from './Toolbar';
import GlobeComponent from './GlobeComponent';
import { CountryStatusProvider } from './CountryStatusContext';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CountryStatusProvider>
        <Toolbar />
        <GlobeComponent />
      </CountryStatusProvider>
    </ThemeProvider>
  );
}

export default App;
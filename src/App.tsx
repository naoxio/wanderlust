import React from 'react';
import { ThemeProvider } from '@mui/material';
import darkTheme from './theme';
import Toolbar from './Toolbar';
import GlobeComponent from './GlobeComponent';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Toolbar />
      <GlobeComponent />
    </ThemeProvider>
  );
}

export default App;
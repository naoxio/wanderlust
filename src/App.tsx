// App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import darkTheme from './theme';
import Toolbar from './Toolbar';
import GlobeComponent from './GlobeComponent';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <Toolbar />
        <GlobeComponent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
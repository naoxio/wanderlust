// App.tsx
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from '@store/index';
import GlobeComponent from '@pages/WorldMapPage';
import darkTheme from '@theme/index';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <GlobeComponent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
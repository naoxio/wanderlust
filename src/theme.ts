import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212121', // Dark gray color
    },
    background: {
      default: '#424242AA',
      paper: '#424242',

    },
  },
});

export default darkTheme;
import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212121', // Dark gray color
    },
    background: {
      default: '#333333', // Lighter dark gray color for background
      paper: '#424242', // Lighter dark gray color for paper (surfaces)
    },
  },
});

export default darkTheme;
'use client';

import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue color
    },
    background: {
      default: '#424242AA',
      paper: '#424242',
    },
    text: {
      primary: '#ffffff', // White color for text
    },
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-checked': {
            color: '#ffffff', 
          },
        },
      },
    },
  },
});

export default darkTheme;
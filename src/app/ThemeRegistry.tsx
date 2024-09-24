'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#87CEEB', // sky-blue
    },
    secondary: {
      main: '#1E3F66', // ocean-blue
    },
    background: {
      default: '#87CEEB', // sky-blue
      paper: '#F2D0A9', // sand-color
    },
    text: {
      primary: '#ffffff',
      secondary: '#1E3F66', // ocean-blue
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
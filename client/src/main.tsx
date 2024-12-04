import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRoutes from './routes'; // Import routes directly

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppRoutes /> {/* Routes manage everything */}
    </ThemeProvider>
  </StrictMode>
);

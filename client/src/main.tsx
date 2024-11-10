import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Example from './TS';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <h2>Corpus Manager</h2>
        <Example />
    </ThemeProvider>
  </StrictMode>,
);


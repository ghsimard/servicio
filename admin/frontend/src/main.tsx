import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import theme from './theme';
import i18n from './i18n';

const queryClient = new QueryClient();

// Create router with future flags to opt into React Router v7 behavior
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )
    }
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider 
      router={router} 
      future={{
        v7_startTransition: true
      }}
    />
  </React.StrictMode>
); 
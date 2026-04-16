import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0C1A13',
                color: '#EEF5F1',
                border: '1px solid rgba(0,229,160,0.15)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Poppins, sans-serif',
              },
              success: { iconTheme: { primary: '#00E5A0', secondary: '#050E0A' } },
              error:   { iconTheme: { primary: '#ff5032', secondary: '#050E0A' } },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
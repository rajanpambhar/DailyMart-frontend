import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#5de4c7',
              secondary: '#1e1e1e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#1e1e1e',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);

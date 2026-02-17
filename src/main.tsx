import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
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
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <div style={{ flex: 1 }}>{message}</div>
                {t.type !== 'loading' && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors ml-2"
                    title="Dismiss"
                  >
                    <X size={14} className="text-gray-400 hover:text-white" />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </BrowserRouter>
  </React.StrictMode>,
);

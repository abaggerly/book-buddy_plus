import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={App} />
    </AuthProvider>
  </StrictMode>
);

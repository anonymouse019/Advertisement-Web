import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Context/AuthContext';  // Adjust path if needed
import App from './App';
import './index.css';  // Your CSS imports

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
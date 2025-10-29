/**
 * Main application entry point - Security hardened
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Security: Validate environment before proceeding
if (typeof window === 'undefined') {
  throw new Error('This application requires a browser environment');
}

// Error boundary for development only
if (import.meta.env.DEV) {
  // Add global error handler for development
  window.addEventListener('error', (event) => {
    if (event.error) {
      console.error('Global error:', event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      console.error('Unhandled promise rejection:', event.reason);
    }
  });
}

// Initialize React application securely
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please ensure there is an element with id="root" in your HTML.');
}

const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot module replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept('./App', (newApp: any) => {
    if (newApp) {
      root.render(
        <React.StrictMode>
          <newApp.default />
        </React.StrictMode>
      );
    }
  });
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}
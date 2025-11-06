// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51RTOhBQZGCMpBfPeFTHpJmtZsJFCRmM5EOzbmsZmQybTaB1osDE2DOs8qgm2apGVCtACXKaYK3m76AUdk2Xae4Yn00uHriu4Ga');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Elements stripe={stripePromise}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </Elements>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
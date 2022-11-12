import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { DataTest } from './components/DataTest';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    { <DataTest></DataTest> }
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { App } from './app.tsx';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: The root element is always there
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} index />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

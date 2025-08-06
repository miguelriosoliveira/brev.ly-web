import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { IndexPage } from './pages/index';
import { NotFoundPage } from './pages/not-found';
import { RedirectPage } from './pages/redirect';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: The root element is always there
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<IndexPage />} index />
        <Route element={<RedirectPage />} path="/:shortUrl" />
        <Route element={<NotFoundPage />} path="/url/not-found" />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { IndexPage } from './pages/index';
import { NotFoundPage } from './pages/not-found';
import { RedirectPage } from './pages/redirect';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: The root element is always there
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="h-dvh px-3 py-8">
        <Routes>
          <Route element={<IndexPage />} index />
          <Route element={<RedirectPage />} path="/:url-encurtada" />
          <Route element={<NotFoundPage />} path="/url/not-found" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  </StrictMode>,
);

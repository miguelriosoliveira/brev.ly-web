import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { RedirectPage } from './pages/redirect';
import './index.css';

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: The root element is always there
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="m-auto h-dvh max-w-[980px] px-3 py-8">
          <Routes>
            <Route element={<HomePage />} index />
            <Route element={<RedirectPage />} path="/:url-encurtada" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

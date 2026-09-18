import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import './styles/island-theme.css';
import App from './App';
import { VisitCounterProvider } from './components/VisitCounterProvider';

const RSVPPage = lazy(() => import('./pages/RSVPPage'));
const InvitationCardPage = lazy(() => import('./pages/InvitationCardPage'));

const PageFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center bg-[#F4E8D8] text-sm text-[#5A7380]">
    載入中…
  </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <VisitCounterProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/rsvp" element={<RSVPPage />} />
            <Route path="/invitation" element={<InvitationCardPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </VisitCounterProvider>
  </React.StrictMode>
);

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = lazy(() => import('./App'));
const RSVPPage = lazy(() => import('./pages/RSVPPage'));
const InvitationPage = lazy(() => import('./pages/InvitationPage'));

const PageFallback = () => (
  <div
    style={{
      display: 'flex',
      minHeight: '50vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4E8D8',
      color: '#5A7380',
      fontSize: 14,
    }}
  >
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
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/rsvp" element={<RSVPPage />} />
          <Route path="/invitation" element={<InvitationPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);

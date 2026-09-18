import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import './styles/island-theme.css';
import App from './App';
import RSVPPage from './pages/RSVPPage';
import InvitationCardPage from './pages/InvitationCardPage';
import { VisitCounterProvider } from './components/VisitCounterProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <VisitCounterProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/rsvp" element={<RSVPPage />} />
          <Route path="/invitation" element={<InvitationCardPage />} />
        </Routes>
      </BrowserRouter>
    </VisitCounterProvider>
  </React.StrictMode>
);

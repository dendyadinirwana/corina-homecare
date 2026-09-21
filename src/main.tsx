import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css';
import './styles/globals.css';
import { useBookingStore } from './store/bookingStore';
import { useReviewStore } from './store/reviewStore';
import { generateIcsContent, downloadIcsFile } from './utils/calendar';

if (typeof window !== 'undefined') {
  (window as any).__BOOKING_STORE__ = useBookingStore;
  (window as any).__REVIEW_STORE__ = useReviewStore;
  (window as any).__CALENDAR__ = { generateIcsContent, downloadIcsFile };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


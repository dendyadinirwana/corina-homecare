import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { BookingStep1Page } from './pages/BookingStep1Page';
import { BookingStep2Page } from './pages/BookingStep2Page';
import { BookingStep3Page } from './pages/BookingStep3Page';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { DemoLayoutPage } from './pages/DemoLayoutPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { WriteReviewPage } from './pages/WriteReviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/booking/langkah-1" element={<BookingStep1Page />} />
        <Route path="/booking/langkah-2" element={<BookingStep2Page />} />
        <Route path="/booking/langkah-3" element={<BookingStep3Page />} />
        <Route path="/booking/konfirmasi" element={<BookingSuccessPage />} />
        <Route path="/ulasan" element={<ReviewsPage />} />
        <Route path="/ulasan/tulis" element={<WriteReviewPage />} />
        <Route path="/demo" element={<DemoLayoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

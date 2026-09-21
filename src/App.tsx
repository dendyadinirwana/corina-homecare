import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { BookingStep1Page } from './pages/BookingStep1Page';
import { BookingStep2Page } from './pages/BookingStep2Page';
import { DemoLayoutPage } from './pages/DemoLayoutPage';
import { MobileFrame } from './components/layout/MobileFrame';
import { Button } from './components/ui/Button';

function BookingStepPlaceholder({ step }: { step: string }) {
  const navigate = useNavigate();
  return (
    <MobileFrame
      title={`Booking Langkah ${step}`}
      showBack={true}
      onBack={() => navigate(-1)}
      contentClassName="p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]"
    >
      <h2 className="text-lg font-bold text-ink-primary">
        Langkah Pemesanan {step}
      </h2>
      <p className="text-sm text-ink-secondary max-w-[260px]">
        Formulir jadwal kunjungan dokter homecare akan aktif di tahap ini.
      </p>
      <Button variant="lime" onClick={() => navigate('/')}>
        Kembali ke Beranda
      </Button>
    </MobileFrame>
  );
}

function ReviewPlaceholder({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <MobileFrame
      title={title}
      showBack={true}
      onBack={() => navigate(-1)}
      contentClassName="p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]"
    >
      <h2 className="text-lg font-bold text-ink-primary">{title}</h2>
      <p className="text-sm text-ink-secondary max-w-[260px]">
        Fitur ulasan pasien dan formulir penilaian dokter.
      </p>
      <Button variant="lime" onClick={() => navigate('/profil')}>
        Kembali ke Profil
      </Button>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/booking/langkah-1" element={<BookingStep1Page />} />
        <Route path="/booking/langkah-2" element={<BookingStep2Page />} />
        <Route path="/booking/langkah-3" element={<BookingStepPlaceholder step="3" />} />
        <Route path="/ulasan" element={<ReviewPlaceholder title="Daftar Ulasan Pasien" />} />
        <Route path="/ulasan/tulis" element={<ReviewPlaceholder title="Tulis Ulasan Pasien" />} />
        <Route path="/demo" element={<DemoLayoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

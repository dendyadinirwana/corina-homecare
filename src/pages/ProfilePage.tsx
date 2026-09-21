import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Star,
  Clock,
  HeartHandshake,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <MobileFrame hideNav={true} contentClassName="p-0 pb-28">
      {/* Hero Photo Section */}
      <div className="relative w-full h-[320px] bg-forest/10 overflow-hidden">
        <img
          src="/doctor-profile.jpg"
          alt="Dr. Corina Wulandari"
          data-testid="profile-hero-image"
          className="w-full h-full object-cover object-top"
        />

        {/* Top Floating Control Bar */}
        <div className="absolute top-3 left-0 right-0 px-4 flex items-center justify-between z-10">
          <button
            type="button"
            aria-label="Kembali"
            data-testid="btn-back"
            onClick={() => navigate('/')}
            className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-ink-primary shadow-sm btn-tactile hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Favorit"
              data-testid="btn-favorite"
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-ink-primary shadow-sm btn-tactile hover:bg-white"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-ink-primary'
                }`}
              />
            </button>
            <button
              type="button"
              aria-label="Menu Lainnya"
              data-testid="btn-more"
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-ink-primary shadow-sm btn-tactile hover:bg-white"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subtle Bottom Gradient for Seamless Transition */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Main Profile Info Container */}
      <div className="relative -mt-6 bg-surface rounded-t-[28px] px-5 pt-4 space-y-4">
        {/* Contact Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <a
            href="tel:081234567890"
            data-testid="contact-pill-phone"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card border border-border-hairline text-xs font-semibold text-ink-primary hover:bg-card-hover btn-tactile shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-forest" />
            <span>0812-3456-7890</span>
          </a>

          <a
            href="mailto:corina@healthrate.id"
            data-testid="contact-pill-email"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card border border-border-hairline text-xs font-semibold text-ink-primary hover:bg-card-hover btn-tactile shrink-0"
          >
            <Mail className="w-3.5 h-3.5 text-forest" />
            <span>corina@healthrate.id</span>
          </a>

          <div
            data-testid="contact-pill-location"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card border border-border-hairline text-xs font-medium text-ink-secondary shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-ink-muted" />
            <span>Tangerang Selatan</span>
          </div>
        </div>

        {/* Doctor Identity Header */}
        <div className="border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            <h1
              data-testid="doctor-name"
              className="text-xl font-bold text-ink-primary tracking-tight"
            >
              Corina Wulandari
            </h1>
            <ShieldCheck className="w-5 h-5 text-forest fill-forest/15" />
          </div>

          <p
            data-testid="doctor-specialty"
            className="text-sm font-medium text-ink-secondary mt-1"
          >
            Dokter Spesialis Penyakit Dalam & Layanan Homecare
          </p>

          <p className="text-xs text-ink-muted mt-1">
            FK UI • Sp.PD (K-KV Sim) • SIP No. 446.1/1082/SIP.D/2022
          </p>

          {/* Rating Badge and Write Review Link */}
          <div className="flex items-center justify-between mt-3 pt-2">
            <Link
              to="/ulasan"
              data-testid="profile-rating-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card hover:bg-card-hover text-xs font-semibold text-ink-primary btn-tactile"
            >
              <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              <span>4.8 • 38 ulasan &gt;</span>
            </Link>

            <Link
              to="/ulasan/tulis"
              data-testid="link-tulis-ulasan"
              className="text-xs font-semibold text-forest hover:underline flex items-center gap-0.5"
            >
              <span>Beri Ulasan &gt;</span>
            </Link>
          </div>
        </div>

        {/* AI Summary Box */}
        <Card
          data-testid="ai-summary-box"
          className="p-4 bg-gradient-to-br from-[#F4F9F5] to-[#EBF5EE] border border-[#D5EAD9] rounded-2xl space-y-2"
          radius="2xl"
        >
          <div className="flex items-center gap-2 text-forest">
            <Sparkles className="w-4 h-4 text-forest" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Ringkasan ulasan kepuasan pasien
            </h2>
          </div>
          <p className="text-xs text-ink-primary leading-relaxed">
            Pasien sangat mengapresiasi ketepatan waktu kedatangan homecare (rata-rata 25 menit) dan kebersihan peralatan medis. Penjelasan diagnosa penyakit dalam disampaikan dengan tenang, bahasa yang mudah dipahami lansia, dan penuh empati tanpa terburu-buru.
          </p>
        </Card>

        {/* 3 Metric Cards */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Metrik Evaluasi Pasien
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            <Card
              data-testid="metric-waktu-tunggu"
              className="p-3 text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1"
              radius="2xl"
            >
              <Clock className="w-4 h-4 text-forest mb-0.5" />
              <div className="text-xs font-semibold text-ink-secondary leading-tight">
                Waktu Tunggu
              </div>
              <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
                <span>4.63</span>
                <span className="text-[#FFB800]">★</span>
              </div>
            </Card>

            <Card
              data-testid="metric-sikap-empati"
              className="p-3 text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1"
              radius="2xl"
            >
              <HeartHandshake className="w-4 h-4 text-forest mb-0.5" />
              <div className="text-xs font-semibold text-ink-secondary leading-tight">
                Sikap & Empati
              </div>
              <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
                <span>4.19</span>
                <span className="text-[#FFB800]">★</span>
              </div>
            </Card>

            <Card
              data-testid="metric-penjelasan"
              className="p-3 text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1"
              radius="2xl"
            >
              <MessageSquareQuote className="w-4 h-4 text-forest mb-0.5" />
              <div className="text-xs font-semibold text-ink-secondary leading-tight">
                Penjelasan
              </div>
              <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
                <span>4.74</span>
                <span className="text-[#FFB800]">★</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Alasan Kunjungan Pasien (Donut Chart & Legend) */}
        <Card
          className="p-4 bg-card border border-border-hairline rounded-2xl space-y-3"
          radius="2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Alasan Kunjungan Pasien
            </h2>
            <span className="text-[11px] text-ink-muted">1.200+ Pasien</span>
          </div>

          <div className="flex items-center justify-around gap-4 py-1">
            {/* SVG Donut Chart */}
            <div data-testid="donut-chart" className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                {/* Segment 1: Hipertensi 35% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1E3322"
                  strokeWidth="12"
                  strokeDasharray="87.96 251.33"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Segment 2: Kardiologi 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#A3D600"
                  strokeWidth="12"
                  strokeDasharray="62.83 251.33"
                  strokeDashoffset="-87.96"
                />
                {/* Segment 3: Gagal Jantung 22% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#34C759"
                  strokeWidth="12"
                  strokeDasharray="55.29 251.33"
                  strokeDashoffset="-150.79"
                />
                {/* Segment 4: Nyeri Dada 18% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#007AFF"
                  strokeWidth="12"
                  strokeDasharray="45.24 251.33"
                  strokeDashoffset="-206.08"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-ink-primary">Kasus</span>
                <span className="text-[10px] text-ink-muted">Homecare</span>
              </div>
            </div>

            {/* Legend */}
            <div data-testid="donut-chart-legend" className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E3322] shrink-0" />
                <span className="text-ink-secondary">Hipertensi</span>
                <span className="font-bold text-ink-primary ml-auto">35%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3D600] shrink-0" />
                <span className="text-ink-secondary">Kardiologi</span>
                <span className="font-bold text-ink-primary ml-auto">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] shrink-0" />
                <span className="text-ink-secondary">Gagal Jantung</span>
                <span className="font-bold text-ink-primary ml-auto">22%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shrink-0" />
                <span className="text-ink-secondary">Nyeri Dada</span>
                <span className="font-bold text-ink-primary ml-auto">18%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Aktivitas Profesional Progress Bar */}
        <Card
          data-testid="professional-activity-bar"
          className="p-4 bg-card border border-border-hairline rounded-2xl space-y-3"
          radius="2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Aktivitas Profesional
            </h2>
            <span className="text-[11px] text-ink-muted">Alokasi Waktu</span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-border-subtle overflow-hidden flex">
            <div
              style={{ width: '47%' }}
              className="h-full bg-[#1E3322]"
              title="Klinis 47%"
            />
            <div
              style={{ width: '24%' }}
              className="h-full bg-[#A3D600]"
              title="Riset 24%"
            />
            <div
              style={{ width: '16%' }}
              className="h-full bg-[#34C759]"
              title="Edukasi 16%"
            />
            <div
              style={{ width: '10%' }}
              className="h-full bg-[#007AFF]"
              title="Publik 10%"
            />
            <div
              style={{ width: '3%' }}
              className="h-full bg-[#8E8E93]"
              title="Lainnya 3%"
            />
          </div>

          {/* Segmented Bar Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-ink-secondary pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E3322]" />
              <span>Klinis: <strong className="text-ink-primary">47%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A3D600]" />
              <span>Riset: <strong className="text-ink-primary">24%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34C759]" />
              <span>Edukasi: <strong className="text-ink-primary">16%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
              <span>Publik: <strong className="text-ink-primary">10%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8E8E93]" />
              <span>Lainnya: <strong className="text-ink-primary">3%</strong></span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Booking Footer */}
      <div
        data-testid="sticky-booking-footer"
        className="fixed sm:absolute bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-border-hairline p-4 px-5 z-20 flex items-center justify-between gap-4"
      >
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Biaya konsultasi
          </span>
          <span className="text-lg font-bold text-ink-primary tracking-tight">
            Rp 250.000
          </span>
        </div>

        <Button
          variant="lime"
          size="lg"
          data-testid="btn-jadwalkan-kunjungan"
          className="flex-1 max-w-[220px] font-bold text-sm shadow-md"
          onClick={() => navigate('/booking/langkah-1')}
        >
          Jadwalkan Kunjungan
        </Button>
      </div>
    </MobileFrame>
  );
};

export default ProfilePage;

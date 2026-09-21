import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ChevronRight,
  Stethoscope,
  Activity,
  Droplet,
  Bandage,
  MapPin,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MobileFrame hideNav={true} contentClassName="p-0 pb-10">
      {/* Doctor Bio Card */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src="/doctor-profile.jpg"
            alt="Corina Wulandari"
            data-testid="doctor-avatar"
            className="w-[92px] h-[92px] rounded-full object-cover border-[3.5px] border-white shadow-md"
          />
        </div>

        <h1
          data-testid="doctor-name"
          className="text-xl font-bold text-ink-primary tracking-tight"
        >
          Corina Wulandari
        </h1>

        <p
          data-testid="doctor-specialty"
          className="text-xs text-ink-secondary mt-1 font-medium max-w-[280px] leading-relaxed"
        >
          Dokter Spesialis Penyakit Dalam & Layanan Homecare
        </p>

        <p
          data-testid="doctor-registration"
          className="text-[11px] text-ink-muted mt-1 tracking-tight"
        >
          SIP No. 446.1/1082/SIP.D/2022 • IDI Tangerang Selatan
        </p>

        {/* Experience Badges */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <Link
            to="/profil"
            data-testid="badge-fk"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full bg-card border border-border-hairline text-xs font-medium text-ink-primary hover:bg-card-hover btn-tactile transition-colors"
          >
            FK UI / Sp.PD
          </Link>
          <Link
            to="/profil"
            data-testid="badge-experience"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full bg-card border border-border-hairline text-xs font-medium text-ink-primary hover:bg-card-hover btn-tactile transition-colors"
          >
            10+ Thn Exp
          </Link>
          <Link
            to="/ulasan"
            data-testid="badge-rating"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full bg-card border border-border-hairline text-xs font-medium text-ink-primary hover:bg-card-hover btn-tactile transition-colors"
          >
            <span className="text-[#FFB800] mr-1">★</span> 4.9 (180+)
          </Link>
        </div>
      </div>

      {/* Emergency WhatsApp Card */}
      <div className="px-4 mb-4">
        <a
          href="https://wa.me/6287772077213?text=Halo%20Dokter%20Corina,%20saya%20memerlukan%20tindakan%20homecare"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="whatsapp-link"
          className="block group select-none"
        >
          <Card
            data-testid="whatsapp-emergency-card"
            className="bg-gradient-to-br from-[#1E3322] to-[#142317] text-white p-4 border border-[#2B4630] shadow-ios-card relative overflow-hidden btn-tactile cursor-pointer rounded-2xl"
            radius="2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 border border-[#25D366]/30 text-[#25D366]">
                  <MessageCircle className="w-6 h-6 fill-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Chat Dokter (WhatsApp)
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Respon cepat • Siaga 24 jam
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                </span>
                <span>• Aktif</span>
              </div>
            </div>
          </Card>
        </a>
      </div>

      {/* 4 Service Action Cards */}
      <div className="px-4 space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted px-1">
          Layanan Praktik Medis Mandiri
        </h2>

        {/* Card 1: Kunjungan Rumah with Lime Button */}
        <Card
          data-testid="service-card-kunjungan-rumah"
          className="p-4 bg-card border border-border-hairline rounded-2xl transition-all"
          radius="2xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 text-forest">
                <Stethoscope className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink-primary truncate">
                  Kunjungan Rumah
                </h3>
                <p className="text-xs text-ink-secondary truncate mt-0.5">
                  Pemeriksaan umum & resep
                </p>
              </div>
            </div>
            <Button
              variant="lime"
              size="sm"
              data-testid="btn-pesan-kunjungan"
              className="shrink-0 px-4 py-1.5 text-xs font-bold"
              onClick={() => navigate('/booking/langkah-1')}
            >
              Pesan
            </Button>
          </div>
        </Card>

        {/* Card 2: Pemeriksaan Lansia & Kronis */}
        <Card
          data-testid="service-card-lansia"
          role="button"
          tabIndex={0}
          interactive
          className="p-4 bg-card border border-border-hairline rounded-2xl flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20"
          radius="2xl"
          onClick={() => navigate('/booking/langkah-1')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/booking/langkah-1');
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 text-forest">
              <Activity className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink-primary truncate">
                Pemeriksaan Lansia & Kronis
              </h3>
              <p className="text-xs text-ink-secondary truncate mt-0.5">
                Cek tensi, gula darah & rekam jantung
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-muted shrink-0 ml-2" />
        </Card>

        {/* Card 3: Pengambilan Darah & Lab */}
        <Card
          data-testid="service-card-lab"
          role="button"
          tabIndex={0}
          interactive
          className="p-4 bg-card border border-border-hairline rounded-2xl flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20"
          radius="2xl"
          onClick={() => navigate('/booking/langkah-1')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/booking/langkah-1');
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 text-forest">
              <Droplet className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink-primary truncate">
                Pengambilan Darah & Lab
              </h3>
              <p className="text-xs text-ink-secondary truncate mt-0.5">
                Sampel di rumah, hasil digital cepat
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-muted shrink-0 ml-2" />
        </Card>

        {/* Card 4: Perawatan Luka & Jahitan */}
        <Card
          data-testid="service-card-perawatan-luka"
          role="button"
          tabIndex={0}
          interactive
          className="p-4 bg-card border border-border-hairline rounded-2xl flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20"
          radius="2xl"
          onClick={() => navigate('/booking/langkah-1')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/booking/langkah-1');
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0 text-forest">
              <Bandage className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink-primary truncate">
                Perawatan Luka & Jahitan
              </h3>
              <p className="text-xs text-ink-secondary truncate mt-0.5">
                Ganti perban steril & lepas benang
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-muted shrink-0 ml-2" />
        </Card>
      </div>

      {/* Domisili Footnote */}
      <div
        data-testid="domisili-footnote"
        className="mt-6 px-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted"
      >
        <MapPin className="w-3.5 h-3.5 text-ink-muted shrink-0" />
        <span>Domisili & Wilayah Kunjungan: Tangerang Selatan & Sekitarnya</span>
      </div>
    </MobileFrame>
  );
};

export default HomePage;

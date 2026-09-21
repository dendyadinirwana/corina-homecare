import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Phone,
  FileText,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useBookingStore } from '../store/bookingStore';
import { downloadIcsFile, formatIndonesianDate } from '../utils/calendar';
import { createWhatsAppBookingUrl } from '../utils/whatsapp';
import type { ConfirmedBooking } from '../types';

export const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const confirmedBooking = useBookingStore((state) => state.confirmedBooking);
  const draft = useBookingStore((state) => state.draft);

  const [showFullDetails, setShowFullDetails] = useState(false);

  // Fallback if accessed directly
  const booking: ConfirmedBooking = confirmedBooking || {
    ...draft,
    id: 'BOOK-HOMECARE-001',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    doctor: {
      name: 'Corina Wulandari',
      title: 'Dokter Spesialis Penyakit Dalam & Layanan Homecare',
    },
  };

  const formattedDate = formatIndonesianDate(booking.date || '2024-06-25');
  const whatsappUrl = createWhatsAppBookingUrl({
    patientName: booking.patientName,
    patientPhone: booking.patientPhone,
    serviceType: booking.serviceType,
    date: booking.date,
    time: booking.time,
    address: booking.address,
    landmark: booking.landmark,
    coordinates: booking.coordinates,
    complaint: booking.complaint,
  });

  const handleDownloadCalendar = () => {
    downloadIcsFile(booking);
  };

  return (
    <MobileFrame
      hideNav={true}
      contentClassName="p-0 pb-16 flex flex-col justify-between"
    >
      {/* Modal Navigation Header */}
      <div className="w-full h-[48px] px-4 flex items-center justify-between border-b border-border-subtle bg-surface sticky top-0 z-20">
        <button
          type="button"
          data-testid="btn-close-modal"
          onClick={() => navigate('/')}
          aria-label="Tutup"
          className="w-[44px] h-[44px] -ml-2 rounded-full inline-flex items-center justify-center text-ink-primary hover:bg-[#F2F2F7] active:scale-95 btn-tactile transition-colors"
        >
          <X className="w-5 h-5 text-ink-primary" />
        </button>

        <span className="text-xs font-semibold text-ink-secondary">
          Konfirmasi Reservasi
        </span>

        <button
          type="button"
          data-testid="btn-finish-modal"
          onClick={() => navigate('/')}
          className="min-h-[44px] px-3 -mr-2 rounded-full inline-flex items-center justify-center text-sm font-bold text-forest hover:bg-[#E8F8EE] active:scale-95 btn-tactile transition-colors"
        >
          Selesai
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-4 pt-5 pb-6 space-y-4">
        {/* Animated Pop-in Checkmark Badge & Hero Title */}
        <div className="flex flex-col items-center text-center pt-2 pb-2">
          <div
            data-testid="badge-success-check"
            className="w-16 h-16 rounded-full bg-lime text-black flex items-center justify-center shadow-md animate-pop-in mb-3 border-4 border-white"
          >
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <h1
            data-testid="booking-success-title"
            className="text-xl font-bold tracking-tight text-ink-primary"
          >
            Janji Temu Dikonfirmasi
          </h1>

          <p
            data-testid="booking-success-subtitle"
            className="text-xs text-ink-secondary mt-1.5 max-w-[280px] leading-relaxed"
          >
            Kunjungan medis telah dijadwalkan. Bukti reservasi telah dikirim ke email.
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EE] text-[#1E3322] text-[11px] font-semibold border border-[#D5EADB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
            <span>ID Booking: #{booking.id.slice(0, 14)}</span>
          </div>
        </div>

        {/* Doctor Card */}
        <Card
          data-testid="success-doctor-card"
          variant="surface"
          padding="sm"
          className="flex items-center gap-3.5 bg-card/80 border border-border-hairline"
        >
          <div className="relative shrink-0">
            <img
              src="/doctor-profile.jpg"
              alt="Corina Wulandari"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#34C759] border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-primary truncate">
                Corina Wulandari
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-forest text-white">
                Dokter Utama
              </span>
            </div>
            <p className="text-xs text-ink-secondary truncate mt-0.5">
              Spesialis Penyakit Dalam & Homecare
            </p>
            <p className="text-[11px] text-ink-muted mt-0.5">
              RS Pondok Indah Bintaro Jaya • Tangsel
            </p>
          </div>
        </Card>

        {/* Reservation Details Card */}
        <Card
          data-testid="reservation-details-card"
          variant="surface"
          padding="md"
          className="space-y-3 border border-border-subtle"
        >
          <div className="pb-2 border-b border-border-subtle">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
              Rincian Jadwal Kunjungan
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-ink-secondary">
            {/* Tanggal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-muted">
                <Calendar className="w-4 h-4 text-forest" />
                <span>Tanggal</span>
              </div>
              <span className="font-semibold text-ink-primary">
                {formattedDate}
              </span>
            </div>

            {/* Jam Kunjungan */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-muted">
                <Clock className="w-4 h-4 text-forest" />
                <span>Jam Kunjungan</span>
              </div>
              <span className="font-semibold text-ink-primary">
                {booking.time || '11:00'} WIB
              </span>
            </div>

            {/* Lokasi Kunjungan */}
            <div className="pt-2 border-t border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-muted">
                  <MapPin className="w-4 h-4 text-forest" />
                  <span>Lokasi Kunjungan</span>
                </div>
                <span className="text-[11px] font-semibold text-forest bg-forest-light px-2.5 py-0.5 rounded-full border border-border-hairline">
                  Rumah Pasien
                </span>
              </div>

              <div className="bg-[#F6F9F6] border border-[#E2ECE4] rounded-xl p-2.5 space-y-1">
                <p className="text-xs font-semibold text-ink-primary leading-snug">
                  {booking.address}
                </p>
                {booking.landmark && (
                  <p className="text-[11px] text-ink-secondary leading-normal">
                    <span className="text-ink-muted font-normal">Patokan:</span>{' '}
                    {booking.landmark}
                  </p>
                )}
                <div className="pt-1 border-t border-[#E2ECE4]/70 flex items-center justify-between">
                  <span className="text-[10px] text-forest font-mono tracking-tight font-medium">
                    GPS: {booking.coordinates?.lat}° S, {booking.coordinates?.lng}° E
                  </span>
                </div>
              </div>
            </div>

            {/* Expandable Extra Details */}
            {showFullDetails && (
              <div className="pt-2 border-t border-border-subtle space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <User className="w-4 h-4 text-forest" />
                    <span>Nama Pasien</span>
                  </div>
                  <span className="font-semibold text-ink-primary">
                    {booking.patientName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Phone className="w-4 h-4 text-forest" />
                    <span>WhatsApp</span>
                  </div>
                  <span className="font-semibold text-ink-primary">
                    {booking.patientPhone}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-ink-muted shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-forest" />
                    <span>Keluhan</span>
                  </div>
                  <span className="text-[11px] font-medium text-ink-primary text-right max-w-[200px]">
                    {booking.complaint}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Email & WhatsApp Confirmation Notice */}
        <div
          data-testid="email-confirmation-notice"
          className="p-3.5 rounded-2xl bg-[#F0F9F4] border border-[#CDE8D8] flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-forest text-lime flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-xs text-ink-secondary space-y-1 flex-1">
            <p className="font-bold text-ink-primary">
              Notifikasi Email & WhatsApp Terkirim
            </p>
            <p className="text-[11px] leading-relaxed">
              Konfirmasi dan rincian persiapan kunjungan telah dikirim ke WhatsApp <strong className="text-ink-primary">{booking.patientPhone}</strong> dan email terdaftar.
            </p>
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-reopen-whatsapp"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                <span>Buka Chat WhatsApp Dokter →</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Add to Calendar Button */}
          <Button
            data-testid="btn-add-to-calendar"
            variant="lime"
            size="lg"
            fullWidth
            onClick={handleDownloadCalendar}
            className="flex items-center justify-center gap-2 min-h-[48px] shadow-sm text-black"
          >
            <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah ke Kalender</span>
          </Button>

          {/* Toggle Full Details */}
          <Button
            data-testid="btn-view-details"
            variant="outline"
            size="md"
            fullWidth
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="flex items-center justify-center gap-1.5 min-h-[44px] text-xs font-semibold"
          >
            <span>{showFullDetails ? 'Sembunyikan Rincian' : 'Lihat Rincian Reservasi'}</span>
            {showFullDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Return Home Button */}
          <Button
            data-testid="btn-back-to-home"
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => navigate('/')}
            className="min-h-[44px] text-xs font-semibold text-ink-secondary hover:text-ink-primary"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default BookingSuccessPage;

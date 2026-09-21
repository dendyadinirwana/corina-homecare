import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MiniDoctorCard } from '../components/booking/MiniDoctorCard';
import { MapPicker } from '../components/map/MapPicker';
import { useBookingStore } from '../store/bookingStore';
import { formatIndonesianDate } from '../utils/calendar';
import { createWhatsAppBookingUrl } from '../utils/whatsapp';
import { submitBooking } from '../services/api';
import type { Coordinates } from '../types';

const COMPLAINT_PRESETS = [
  'Demam tinggi 3 hari, lemas & riwayat hipertensi',
  'Pemeriksaan Lansia & Tirah Baring',
  'Kontrol Rutin Hipertensi / Diabetes',
  'Luka, Ganti Verban & Pasca Operasi',
  'Konsultasi Keluhan Medis Lainnya',
];

export const BookingStep3Page: React.FC = () => {
  const navigate = useNavigate();
  const draft = useBookingStore((state) => state.draft);
  const setDraft = useBookingStore((state) => state.setDraft);
  const confirmBooking = useBookingStore((state) => state.confirmBooking);
  const setConfirmedBooking = useBookingStore((state) => state.setConfirmedBooking);

  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!conflictError) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/booking/langkah-2');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conflictError, navigate]);

  // Local form state initialized from draft
  const [patientName, setPatientName] = useState(
    draft.patientName || 'Budi Santoso (58 thn)'
  );
  const [patientPhone, setPatientPhone] = useState(
    draft.patientPhone || '+62 812-8921-4450'
  );
  const [address, setAddress] = useState(
    draft.address || 'Jl. Bintaro Utama Sektor 7, Tangerang Selatan'
  );
  const [landmark, setLandmark] = useState(
    draft.landmark || 'Rumah Pagar Hitam No. 12, seberang Taman'
  );
  const [coordinates, setCoordinates] = useState<Coordinates>(
    draft.coordinates || { lat: -6.2841, lng: 106.7265 }
  );
  const [complaintCategory, setComplaintCategory] = useState(
    draft.complaint || COMPLAINT_PRESETS[0]
  );
  const [complaintDetail, setComplaintDetail] = useState(
    draft.complaint || COMPLAINT_PRESETS[0]
  );

  const formattedDate = formatIndonesianDate(draft.date || '2024-06-25');
  const serviceLabel =
    draft.serviceType === 'teleconsultation'
      ? 'Telekonsultasi Video'
      : 'Kunjungan Dokter ke Rumah';

  const handleComplaintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setComplaintCategory(val);
    setComplaintDetail(val);
  };

  const handleCoordinatesChange = (newCoords: Coordinates) => {
    setCoordinates(newCoords);
    setDraft({ coordinates: newCoords });
  };

  const handleBack = () => {
    setDraft({
      patientName,
      patientPhone,
      address,
      landmark,
      coordinates,
      complaint: complaintDetail || complaintCategory,
    });
    navigate('/booking/langkah-2');
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;

    const finalComplaint = complaintDetail || complaintCategory;
    const currentDraft = {
      ...draft,
      patientName,
      patientPhone,
      address,
      landmark,
      coordinates,
      complaint: finalComplaint,
    };
    setDraft(currentDraft);

    setIsSubmitting(true);
    try {
      const result = await submitBooking(currentDraft);

      if (!result.success) {
        if (result.error === 'SLOT_ALREADY_BOOKED') {
          setConflictError(
            result.message ||
              'Slot jadwal pada jam ini sudah dipesan oleh pasien lain. Silakan pilih jadwal lain.'
          );
        } else {
          alert(result.message || 'Terjadi kendala saat memproses reservasi. Silakan coba lagi.');
        }
        return;
      }

      const confirmed = confirmBooking();
      if (result.bookingId && confirmed) {
        setConfirmedBooking({ ...confirmed, id: result.bookingId });
      }

      const whatsappUrl = createWhatsAppBookingUrl({
        patientName,
        patientPhone,
        serviceType: draft.serviceType,
        date: draft.date,
        time: draft.time,
        address,
        landmark,
        coordinates,
        complaint: finalComplaint,
      });

      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      navigate('/booking/konfirmasi');
    } catch (err) {
      console.error('Failed to submit booking:', err);
      confirmBooking();
      navigate('/booking/konfirmasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileFrame
      title="Buat Janji Temu"
      showBack={true}
      onBack={handleBack}
      contentClassName="p-0 flex flex-col justify-between"
    >
      <div className="px-4 pt-3 pb-28 space-y-4">
        {/* Stepper Wizard (Step 3 active, Steps 1 & 2 completed) */}
        <div className="ios-stagger">
          <Stepper currentStep={3} />
        </div>

        {/* Mini Doctor Card */}
        <div className="ios-stagger">
          <MiniDoctorCard />
        </div>

        {/* Section 1: Data Pasien & Kontak */}
        <Card variant="surface" padding="md" className="space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-border-subtle">
            <User className="w-4 h-4 text-forest" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
              Data Pasien & Kontak
            </h3>
          </div>

          {/* Patient Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="patient-name"
              className="block text-xs font-semibold text-ink-primary"
            >
              Nama Lengkap Pasien
            </label>
            <div className="relative">
              <input
                id="patient-name"
                type="text"
                data-testid="input-patient-name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Contoh: Hj. Siti Rahma (65 thn)"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-sm text-ink-primary placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="patient-phone"
              className="block text-xs font-semibold text-ink-primary"
            >
              Nomor WhatsApp Aktif
            </label>
            <input
              id="patient-phone"
              type="tel"
              data-testid="input-patient-phone"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-sm text-ink-primary placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
            />
          </div>
        </Card>

        {/* Section 2: Alamat & Titik Koordinat Peta */}
        <Card variant="surface" padding="md" className="space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-forest" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
                Alamat & Titik Koordinat Peta
              </h3>
            </div>
            <span className="text-[10px] text-ink-muted">Akurat GPS</span>
          </div>

          {/* Leaflet Interactive Map */}
          <div className="space-y-1">
            <MapPicker
              coordinates={coordinates}
              onChange={handleCoordinatesChange}
            />
            <p className="text-[11px] text-ink-muted px-1">
              Geser pin atau sentuh peta untuk menentukan titik pintu masuk rumah.
            </p>
          </div>

          {/* Address Textarea / Input */}
          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="patient-address"
              className="block text-xs font-semibold text-ink-primary"
            >
              Alamat Lengkap Rumah
            </label>
            <input
              id="patient-address"
              type="text"
              data-testid="input-patient-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, Blok, Nomor Rumah, RT/RW, Kelurahan"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-sm text-ink-primary placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
            />
          </div>

          {/* Landmark Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="patient-landmark"
              className="block text-xs font-semibold text-ink-primary"
            >
              Patokan / Ciri Rumah
            </label>
            <input
              id="patient-landmark"
              type="text"
              data-testid="input-patient-landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Contoh: Pagar warna hitam no. 12, seberang taman"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-sm text-ink-primary placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
            />
          </div>
        </Card>

        {/* Section 3: Keluhan Medis & Catatan */}
        <Card variant="surface" padding="md" className="space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-border-subtle">
            <Stethoscope className="w-4 h-4 text-forest" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
              Keluhan Medis Pasien
            </h3>
          </div>

          {/* Complaint Select */}
          <div className="space-y-1.5">
            <label
              htmlFor="complaint-select"
              className="block text-xs font-semibold text-ink-primary"
            >
              Kategori Keluhan Utama
            </label>
            <div className="relative">
              <select
                id="complaint-select"
                data-testid="select-complaint"
                value={complaintCategory}
                onChange={handleComplaintChange}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-xs font-medium text-ink-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all appearance-none cursor-pointer"
              >
                {COMPLAINT_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Complaint Details Textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="complaint-textarea"
              className="block text-xs font-semibold text-ink-primary"
            >
              Rincian Gejala & Riwayat Obat
            </label>
            <textarea
              id="complaint-textarea"
              rows={3}
              data-testid="textarea-complaint"
              value={complaintDetail}
              onChange={(e) => setComplaintDetail(e.target.value)}
              placeholder="Tuliskan keluhan yang dirasakan, sejak kapan, atau alergi obat..."
              className="w-full min-h-[72px] px-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-border-hairline text-xs text-ink-primary placeholder:text-ink-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none leading-relaxed"
            />
          </div>
        </Card>

        {/* Section 4: Live Booking Summary Card */}
        <Card
          data-testid="booking-live-summary"
          variant="surface"
          padding="md"
          className="bg-[#F6FAF7] border border-[#D5EADB] space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-forest uppercase">
              RINGKASAN JADWAL & KUNJUNGAN
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
              Terverifikasi
            </span>
          </div>

          <div className="space-y-2 text-xs text-ink-secondary divide-y divide-[#E0EBE2]">
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Calendar className="w-3.5 h-3.5 text-forest" />
                <span>Tanggal</span>
              </div>
              <span className="font-semibold text-ink-primary">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Clock className="w-3.5 h-3.5 text-forest" />
                <span>Waktu</span>
              </div>
              <span className="font-semibold text-ink-primary">
                {draft.time || '11:00'} WIB
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <FileText className="w-3.5 h-3.5 text-forest" />
                <span>Layanan</span>
              </div>
              <span className="font-semibold text-ink-primary">
                {serviceLabel}
              </span>
            </div>

            <div className="flex items-start justify-between pt-2 gap-3">
              <div className="flex items-center gap-1.5 text-ink-muted shrink-0">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                <span>Tujuan</span>
              </div>
              <span className="font-semibold text-ink-primary text-right">
                {address || 'Tangerang Selatan'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <User className="w-3.5 h-3.5 text-forest" />
                <span>Dokter</span>
              </div>
              <span className="font-bold text-forest">
                dr. Corina Wulandari, Sp.PD
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-border-subtle p-4 pb-[max(1rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] z-10">
        <Button
          data-testid="btn-confirm-booking"
          variant="lime"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleConfirm}
          className="shadow-sm min-h-[48px] flex items-center justify-center gap-2 font-bold"
        >
          <MessageCircle className="w-5 h-5 fill-[#1E3322] text-[#1E3322]" />
          <span>Konfirmasi Janji Temu via WhatsApp →</span>
        </Button>
      </div>

      {/* Slot Collision Conflict Modal */}
      {conflictError && (
        <div
          data-testid="modal-slot-conflict"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-slot-conflict-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl border border-border-hairline text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 id="modal-slot-conflict-title" className="text-base font-bold text-ink-primary">
                Jadwal Sudah Terisi
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {conflictError}
              </p>
            </div>
            <Button
              data-testid="btn-reselect-slot"
              variant="forest"
              size="md"
              fullWidth
              autoFocus
              onClick={() => navigate('/booking/langkah-2')}
              className="min-h-[44px] font-bold"
            >
              Pilih Jam Lain
            </Button>
          </div>
        </div>
      )}
    </MobileFrame>
  );
};

export default BookingStep3Page;

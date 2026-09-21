import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Home,
  Video,
  CheckCircle2,
  Circle,
  ShieldCheck,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MiniDoctorCard } from '../components/booking/MiniDoctorCard';
import { useBookingStore } from '../store/bookingStore';
import {
  INDONESIAN_DAYS_SHORT,
  INDONESIAN_MONTHS,
  formatDateToYmd,
  parseYmdDate,
  formatIndonesianDate,
} from '../utils/calendar';
import type { ServiceType } from '../types';

export const BookingStep1Page: React.FC = () => {
  const navigate = useNavigate();
  const draft = useBookingStore((state) => state.draft);
  const setDraft = useBookingStore((state) => state.setDraft);

  // Initialize selected date from store draft or fallback
  const initialDateStr = draft.date || '2024-06-25';
  const [selectedDate, setSelectedDate] = useState<string>(initialDateStr);

  // Service type state initialized from store draft
  const [serviceType, setServiceType] = useState<ServiceType>(
    draft.serviceType || 'homecare'
  );

  // Manage start of visible 7 days (by default start on Sunday of the week containing June 25, 2024 -> June 23, 2024)
  const initialBaseDate = parseYmdDate(initialDateStr);
  const dayOfWeek = initialBaseDate.getDay(); // 0 is Sunday, 2 is Tuesday
  const defaultWeekStart = new Date(
    initialBaseDate.getFullYear(),
    initialBaseDate.getMonth(),
    initialBaseDate.getDate() - dayOfWeek
  );

  const [weekStart, setWeekStart] = useState<Date>(defaultWeekStart);

  // Generate 7 consecutive days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + i
    );
    const ymd = formatDateToYmd(d);
    return {
      dateStr: ymd,
      dayNum: d.getDate(),
      dayName: INDONESIAN_DAYS_SHORT[d.getDay()],
      monthName: INDONESIAN_MONTHS[d.getMonth()],
      fullDate: d,
    };
  });

  const handlePrevWeek = () => {
    setWeekStart(
      new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() - 7
      )
    );
  };

  const handleNextWeek = () => {
    setWeekStart(
      new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + 7
      )
    );
  };

  // Month-Year label for the header (e.g. "Juni 2024")
  const currentMonthLabel = `${INDONESIAN_MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`;

  const handleContinue = () => {
    setDraft({
      date: selectedDate,
      serviceType,
    });
    navigate('/booking/langkah-2');
  };

  return (
    <MobileFrame
      title="Pilih Tanggal & Kunjungan"
      showBack={true}
      onBack={() => navigate('/')}
      contentClassName="p-0 flex flex-col justify-between"
    >
      <div className="px-4 pt-3 pb-24 space-y-4">
        {/* Stepper Wizard (Step 1 active) */}
        <div className="ios-stagger">
          <Stepper currentStep={1} />
        </div>

        {/* Mini Doctor Card */}
        <div className="ios-stagger">
          <MiniDoctorCard />
        </div>

        {/* 7-Day Horizontal Calendar Section */}
        <div data-testid="calendar-picker-section" className="ios-stagger space-y-2.5">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h3 className="text-sm font-bold text-ink-primary tracking-tight">
                Pilih Tanggal Kunjungan
              </h3>
              <p
                data-testid="calendar-month-label"
                className="text-xs font-semibold text-forest mt-0.5"
              >
                {currentMonthLabel}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                data-testid="btn-prev-month"
                onClick={handlePrevWeek}
                aria-label="Minggu Sebelumnya"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-card-hover btn-tactile border border-border-hairline"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                data-testid="btn-next-month"
                onClick={handleNextWeek}
                aria-label="Minggu Selanjutnya"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-card-hover btn-tactile border border-border-hairline"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 7-Day Horizontal Strip */}
          <div className="grid grid-cols-7 gap-1 xs:gap-1.5 pt-1">
            {weekDays.map((item) => {
              const isSelected = item.dateStr === selectedDate;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  data-testid={`calendar-day-${item.dateStr}`}
                  data-active={isSelected ? 'true' : 'false'}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-w-0 flex flex-col items-center justify-center py-2 px-0.5 xs:px-1 rounded-2xl h-[58px] transition-all duration-quick btn-tactile ${
                    isSelected
                      ? 'bg-forest text-white shadow-md ring-2 ring-forest/30 scale-[1.02]'
                      : 'bg-card text-ink-primary border border-border-subtle hover:bg-card-hover'
                  }`}
                >
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isSelected ? 'text-white/80' : 'text-ink-muted'
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span
                    className={`text-base font-bold mt-0.5 ${
                      isSelected ? 'text-white' : 'text-ink-primary'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 transition-opacity ${
                      isSelected ? 'bg-lime' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Date Summary Card */}
          <Card
            data-testid="selected-date-summary"
            variant="surface"
            padding="sm"
            className="flex items-center gap-3 bg-[#F4F9F5] border border-[#D5EADB] mt-2"
          >
            <div className="w-9 h-9 rounded-xl bg-forest text-white flex items-center justify-center shrink-0 shadow-sm">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-medium text-ink-secondary block">
                Tanggal Kunjungan Terpilih
              </span>
              <span className="text-xs font-bold text-ink-primary truncate block mt-0.5">
                {formatIndonesianDate(selectedDate)}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-forest bg-white px-2 py-0.5 rounded-full border border-[#D5EADB]">
              Tersedia
            </span>
          </Card>
        </div>

        {/* Visit Service Type Radio Selection */}
        <div className="ios-stagger space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary tracking-tight">
              Pilih Jenis Layanan Kunjungan
            </h3>
            <span className="text-[11px] text-ink-muted font-normal">
              1 Pilihan
            </span>
          </div>

          {/* Option 1: Kunjungan Dokter ke Rumah */}
          <div
            role="radio"
            aria-checked={serviceType === 'homecare'}
            tabIndex={0}
            data-testid="service-type-homecare"
            data-checked={serviceType === 'homecare' ? 'true' : 'false'}
            onClick={() => setServiceType('homecare')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') setServiceType('homecare');
            }}
            className={`p-3.5 rounded-2xl border transition-all duration-quick cursor-pointer btn-tactile flex items-start gap-3.5 ${
              serviceType === 'homecare'
                ? 'bg-[#F7FBF8] border-forest shadow-sm ring-1 ring-forest/20'
                : 'bg-card border-border-hairline hover:bg-card-hover'
            }`}
          >
            <div className="pt-0.5">
              {serviceType === 'homecare' ? (
                <CheckCircle2 className="w-5 h-5 text-forest fill-forest/10" />
              ) : (
                <Circle className="w-5 h-5 text-ink-muted/50" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-forest shrink-0" />
                  <span className="text-sm font-bold text-ink-primary">
                    Kunjungan Dokter ke Rumah
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#1E3322] bg-lime/70 px-2 py-0.5 rounded-full">
                  Populer
                </span>
              </div>

              <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                Corina visit ke tempat / rumah pasien • Tangerang Selatan • Bawa alat & resep
              </p>

              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-forest font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Peralatan steril & tensimeter digital lengkap</span>
              </div>
            </div>
          </div>

          {/* Option 2: Telekonsultasi Video */}
          <div
            role="radio"
            aria-checked={serviceType === 'teleconsultation'}
            tabIndex={0}
            data-testid="service-type-teleconsultation"
            data-checked={serviceType === 'teleconsultation' ? 'true' : 'false'}
            onClick={() => setServiceType('teleconsultation')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') setServiceType('teleconsultation');
            }}
            className={`p-3.5 rounded-2xl border transition-all duration-quick cursor-pointer btn-tactile flex items-start gap-3.5 ${
              serviceType === 'teleconsultation'
                ? 'bg-[#F7FBF8] border-forest shadow-sm ring-1 ring-forest/20'
                : 'bg-card border-border-hairline hover:bg-card-hover'
            }`}
          >
            <div className="pt-0.5">
              {serviceType === 'teleconsultation' ? (
                <CheckCircle2 className="w-5 h-5 text-forest fill-forest/10" />
              ) : (
                <Circle className="w-5 h-5 text-ink-muted/50" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-forest shrink-0" />
                <span className="text-sm font-bold text-ink-primary">
                  Telekonsultasi Video
                </span>
              </div>

              <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                Konsultasi daring via video call (Tatap muka virtual langsung & e-resep resmi)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-border-subtle p-4 pb-[max(1rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] z-10">
        <Button
          data-testid="btn-next-step-1"
          variant="lime"
          size="lg"
          fullWidth
          onClick={handleContinue}
          className="shadow-sm"
        >
          Lanjut Pilih Jam Kunjungan →
        </Button>
      </div>
    </MobileFrame>
  );
};

export default BookingStep1Page;

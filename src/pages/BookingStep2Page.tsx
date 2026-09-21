import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Sun, Sunset, Moon, Edit2 } from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MiniDoctorCard } from '../components/booking/MiniDoctorCard';
import { useBookingStore } from '../store/bookingStore';
import { formatIndonesianDate } from '../utils/calendar';
import { fetchSlotAvailability } from '../services/api';

export const BookingStep2Page: React.FC = () => {
  const navigate = useNavigate();
  const draft = useBookingStore((state) => state.draft);
  const setDraft = useBookingStore((state) => state.setDraft);

  const [selectedTime, setSelectedTime] = useState<string>(
    draft.time || '11:00'
  );
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const selectedDate = draft.date || '2024-06-25';
  const formattedDate = formatIndonesianDate(selectedDate);
  const serviceLabel =
    draft.serviceType === 'teleconsultation'
      ? 'Telekonsultasi Video • Daring'
      : 'Kunjungan Dokter ke Rumah • Tangerang Selatan';

  useEffect(() => {
    let isMounted = true;
    fetchSlotAvailability(selectedDate)
      .then((slots) => {
        if (!isMounted) return;
        setBookedSlots(slots);
        setSelectedTime((curr) => (slots.includes(curr) ? '' : curr));
      })
      .catch((err) => {
        console.error('Failed to fetch slot availability:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const timeGroups = [
    {
      id: 'pagi',
      testId: 'time-group-pagi',
      title: 'Pagi',
      icon: Sun,
      slots: ['09:00', '10:00', '11:00', '12:00'],
    },
    {
      id: 'siang',
      testId: 'time-group-siang',
      title: 'Siang',
      icon: Sunset,
      slots: ['13:00', '14:00', '15:00', '16:00'],
    },
    {
      id: 'sore-malam',
      testId: 'time-group-sore-malam',
      title: 'Sore & Malam',
      icon: Moon,
      slots: ['17:00', '18:00', '19:00', '20:00'],
    },
  ];

  const handleContinue = () => {
    if (!selectedTime) return;
    setDraft({ time: selectedTime });
    navigate('/booking/langkah-3');
  };

  return (
    <MobileFrame
      title="Buat Janji Temu"
      showBack={true}
      onBack={() => navigate('/booking/langkah-1')}
      contentClassName="p-0 flex flex-col justify-between"
    >
      <div className="px-4 pt-3 pb-24 space-y-4">
        {/* Stepper Wizard (Step 2 active, Step 1 completed) */}
        <div className="ios-stagger">
          <Stepper currentStep={2} />
        </div>

        {/* Mini Doctor Card */}
        <div className="ios-stagger">
          <MiniDoctorCard />
        </div>

        {/* Selected Date Banner with Ubah Button */}
        <div className="ios-stagger">
          <Card
            data-testid="selected-date-banner"
            variant="surface"
            padding="sm"
            className="bg-[#F6FAF7] border border-[#D5EADB] relative overflow-hidden"
          >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-forest uppercase block">
                  TANGGAL KUNJUNGAN
                </span>
                <p className="text-sm font-bold text-ink-primary mt-0.5">
                  {formattedDate}
                </p>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {serviceLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              data-testid="btn-ubah-tanggal"
              onClick={() => navigate('/booking/langkah-1')}
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold text-forest bg-white border border-[#D5EADB] hover:bg-[#E8F8EE] btn-tactile shadow-2xs shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Ubah</span>
            </button>
          </div>
        </Card>
        </div>

        {/* Time Slots Grid Sections */}
        <div className="ios-stagger space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-primary tracking-tight">
              Pilih Waktu Kunjungan
            </h3>
            <span className="text-[11px] text-ink-muted font-normal">
              Zona WIB
            </span>
          </div>

          {timeGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                data-testid={group.testId}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
                  <Icon className="w-3.5 h-3.5 text-forest" />
                  <span>{group.title}</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 xs:gap-2">
                  {group.slots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isActive = slot === selectedTime;
                    return (
                      <button
                        key={slot}
                        type="button"
                        data-testid={`time-slot-${slot}`}
                        data-active={isActive ? 'true' : 'false'}
                        aria-label={`${slot}${isBooked ? ', Terisi' : ''}`}
                        disabled={isBooked}
                        onClick={() => !isBooked && setSelectedTime(slot)}
                        className={`min-h-[44px] px-1 xs:px-2 py-2 rounded-xl text-xs font-semibold transition-all duration-quick btn-tactile flex flex-col items-center justify-center relative ${
                          isBooked
                            ? 'opacity-50 cursor-not-allowed bg-card border border-border-hairline text-ink-muted line-through'
                            : isActive
                            ? 'bg-forest text-white border-2 border-forest shadow-sm ring-2 ring-forest/20'
                            : 'bg-card text-ink-primary border border-border-hairline hover:bg-card-hover hover:border-ink-muted/30'
                        }`}
                      >
                        <span>{slot}</span>
                        {isBooked && (
                          <span className="text-[10px] font-medium no-underline tracking-normal text-ink-muted mt-0.5">
                            Terisi
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical Equipment Notice Banner */}
        <div
          data-testid="medical-notice-banner"
          className="ios-stagger p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#E0EBE2] flex items-start gap-3"
        >
          <div className="w-7 h-7 rounded-lg bg-[#E8F8EE] text-forest flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4 text-forest" />
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Waktu mengacu pada <strong className="text-ink-primary font-semibold">Waktu Indonesia Barat (WIB)</strong>. Dokter tiba tepat waktu membawa <strong className="text-ink-primary font-semibold">peralatan medis steril</strong>.
          </p>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-border-subtle p-4 pb-[max(1rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] z-10">
        <Button
          data-testid="btn-next-step-2"
          variant="lime"
          size="lg"
          fullWidth
          disabled={!selectedTime}
          onClick={handleContinue}
          className="shadow-sm"
        >
          Lanjut ke Data Pasien →
        </Button>
      </div>
    </MobileFrame>
  );
};

export default BookingStep2Page;

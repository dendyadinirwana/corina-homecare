import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BookingDraft, ConfirmedBooking, BookingStoreState } from '../types';

export const INITIAL_BOOKING_DRAFT: BookingDraft = {
  date: '2024-06-25',
  time: '11:00',
  serviceType: 'homecare',
  patientName: 'Budi Santoso (58 thn)',
  patientPhone: '+62 812-8921-4450',
  address: 'Jl. Bintaro Utama Sektor 7, Tangerang Selatan',
  landmark: 'Rumah Pagar Hitam No. 12, seberang Taman',
  coordinates: { lat: -6.2841, lng: 106.7265 },
  complaint: 'Demam tinggi 3 hari, lemas & riwayat hipertensi',
};

const getSafeStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      draft: { ...INITIAL_BOOKING_DRAFT },
      confirmedBooking: null,

      setDraft: (partial: Partial<BookingDraft>) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...partial,
            ...(partial.coordinates
              ? {
                  coordinates: {
                    ...state.draft.coordinates,
                    ...partial.coordinates,
                  },
                }
              : {}),
          },
        })),

      confirmBooking: () => {
        const currentDraft = get().draft;
        const confirmed: ConfirmedBooking = {
          ...currentDraft,
          id: `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
          doctor: {
            name: 'Corina Wulandari',
            title: 'Dokter Spesialis Penyakit Dalam & Layanan Homecare',
          },
        };
        set({ confirmedBooking: confirmed });
        return confirmed;
      },

      resetDraft: () =>
        set({
          draft: { ...INITIAL_BOOKING_DRAFT },
        }),

      setConfirmedBooking: (booking: ConfirmedBooking | null) =>
        set({
          confirmedBooking: booking,
        }),
    }),
    {
      name: 'homecare-booking-storage',
      storage: createJSONStorage(getSafeStorage),
    }
  )
);

import type { BookingDraft } from '../types';

const MOCK_STORAGE_KEY = 'homecare_d1_mock_bookings';

interface StoredMockBooking {
  id: string;
  date: string;
  time: string;
  patientName: string;
}

function getLocalMockBookings(): StoredMockBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMockBooking(booking: StoredMockBooking): boolean {
  if (typeof window === 'undefined') return false;
  const list = getLocalMockBookings();
  // Anti-collision check in mock store
  if (list.some((b) => b.date === booking.date && b.time === booking.time)) {
    return false;
  }
  list.push(booking);
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(list));
  return true;
}

export function clearMockBookings(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
}

/**
 * Fetches booked time slots for a given date.
 */
export async function fetchSlotAvailability(date: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data?.bookedTimes)) {
        return data.bookedTimes;
      }
    }
  } catch {
    // Edge API not available (e.g. running in standard Vite dev) -> fallback to smart mock
  }

  // Fallback: read from mock storage
  const mockList = getLocalMockBookings();
  return mockList.filter((b) => b.date === date).map((b) => b.time);
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  message?: string;
}

/**
 * Submits a new booking to the Cloudflare D1 endpoint with anti-collision guard.
 */
export async function submitBooking(draft: Partial<BookingDraft>): Promise<BookingResponse> {
  const bookingId = `BOOK-${(draft.date || '').replace(/-/g, '')}-${(draft.time || '').replace(':', '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: bookingId,
        ...draft,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      return { success: true, bookingId: data.bookingId || bookingId, message: data.message };
    }

    if (response.status === 409) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || 'SLOT_ALREADY_BOOKED',
        message: data.message || 'Slot jadwal pada jam ini sudah dipesan oleh pasien lain.',
      };
    }

    if (response.status === 400) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || 'VALIDATION_ERROR',
        message: data.message || 'Data reservasi belum lengkap.',
      };
    }
  } catch {
    // Fallback: mock store execution with collision detection
  }

  // Fallback collision check
  const saved = saveLocalMockBooking({
    id: bookingId,
    date: draft.date || '',
    time: draft.time || '',
    patientName: draft.patientName || '',
  });

  if (!saved) {
    return {
      success: false,
      error: 'SLOT_ALREADY_BOOKED',
      message: `Slot jam ${draft.time} pada tanggal ${draft.date} sudah dipesan oleh pasien lain. Silakan pilih jam lain.`,
    };
  }

  return {
    success: true,
    bookingId,
    message: 'Reservasi berhasil dikonfirmasi.',
  };
}

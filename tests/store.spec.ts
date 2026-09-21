import { test, expect } from '@playwright/test';

test.describe('Task 3: State Management & Types (Booking & Review Stores)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('BookingStore initializes with specified default draft values', async ({ page }) => {
    const draft = await page.evaluate(() => {
      const store = (window as any).__BOOKING_STORE__;
      return store ? store.getState().draft : null;
    });

    expect(draft).not.toBeNull();
    expect.soft(draft?.date).toBe('2024-06-25');
    expect.soft(draft?.time).toBe('11:00');
    expect.soft(draft?.serviceType).toBe('homecare');
    expect.soft(draft?.patientName).toBe('Budi Santoso (58 thn)');
    expect.soft(draft?.patientPhone).toBe('+62 812-8921-4450');
    expect.soft(draft?.address).toBe('Jl. Bintaro Utama Sektor 7, Tangerang Selatan');
    expect.soft(draft?.landmark).toBe('Rumah Pagar Hitam No. 12, seberang Taman');
    expect.soft(draft?.coordinates?.lat).toBeCloseTo(-6.2841, 4);
    expect.soft(draft?.coordinates?.lng).toBeCloseTo(106.7265, 4);
    expect.soft(draft?.complaint).toBe('Demam tinggi 3 hari, lemas & riwayat hipertensi');
  });

  test('BookingStore updates draft, confirms booking, resets draft, and persists to localStorage', async ({ page }) => {
    // 1. Update draft
    await page.evaluate(() => {
      const store = (window as any).__BOOKING_STORE__;
      store.getState().setDraft({
        patientName: 'Dewi Sartika',
        time: '14:00',
        complaint: 'Pemeriksaan rutin gula darah',
      });
    });

    // Check in-memory update
    const updatedDraft = await page.evaluate(() => {
      return (window as any).__BOOKING_STORE__.getState().draft;
    });
    expect.soft(updatedDraft.patientName).toBe('Dewi Sartika');
    expect.soft(updatedDraft.time).toBe('14:00');
    expect.soft(updatedDraft.complaint).toBe('Pemeriksaan rutin gula darah');

    // Confirm booking
    const confirmed = await page.evaluate(() => {
      return (window as any).__BOOKING_STORE__.getState().confirmBooking();
    });
    expect.soft(confirmed).toBeDefined();
    expect.soft(confirmed.id).toBeTruthy();
    expect.soft(confirmed.patientName).toBe('Dewi Sartika');
    expect.soft(confirmed.status).toBe('confirmed');

    // Verify localStorage persistence under 'homecare-booking-storage'
    const storageItem = await page.evaluate(() => {
      const raw = localStorage.getItem('homecare-booking-storage');
      return raw ? JSON.parse(raw) : null;
    });
    expect.soft(storageItem).not.toBeNull();
    expect.soft(storageItem.state.draft.patientName).toBe('Dewi Sartika');
    expect.soft(storageItem.state.confirmedBooking?.id).toBe(confirmed.id);

    // Reload page to verify hydration from localStorage
    await page.reload();
    const rehydrated = await page.evaluate(() => {
      const state = (window as any).__BOOKING_STORE__.getState();
      return {
        draft: state.draft,
        confirmedBooking: state.confirmedBooking,
      };
    });
    expect.soft(rehydrated.draft.patientName).toBe('Dewi Sartika');
    expect.soft(rehydrated.confirmedBooking?.id).toBe(confirmed.id);

    // Reset draft
    await page.evaluate(() => {
      (window as any).__BOOKING_STORE__.getState().resetDraft();
    });
    const resetDraft = await page.evaluate(() => {
      return (window as any).__BOOKING_STORE__.getState().draft;
    });
    expect.soft(resetDraft.patientName).toBe('Budi Santoso (58 thn)');
  });

  test('ReviewStore initializes with 3 seeded authentic reviews from homecare.pen', async ({ page }) => {
    const reviews = await page.evaluate(() => {
      const store = (window as any).__REVIEW_STORE__;
      return store ? store.getState().reviews : null;
    });

    expect(reviews).not.toBeNull();
    expect.soft(reviews.length).toBe(3);

    // Review 1: Siti Rahmawati
    const siti = reviews.find((r: any) => r.patientName.includes('Siti Rahmawati'));
    expect.soft(siti).toBeDefined();
    expect.soft(siti.initials).toBe('SR');
    expect.soft(siti.verified).toBe(true);
    expect.soft(siti.rating).toBe(5);
    expect.soft(siti.likes).toBe(14);
    expect.soft(siti.content).toContain('paska stroke');

    // Review 2: Bambang Sudirgo
    const bambang = reviews.find((r: any) => r.patientName.includes('Bambang Sudirgo'));
    expect.soft(bambang).toBeDefined();
    expect.soft(bambang.initials).toBe('BS');
    expect.soft(bambang.verified).toBe(true);
    expect.soft(bambang.rating).toBe(5);
    expect.soft(bambang.likes).toBe(9);
    expect.soft(bambang.content).toContain('dekubitus');

    // Review 3: dr. Hendra Wijaya
    const hendra = reviews.find((r: any) => r.patientName.includes('Hendra Wijaya'));
    expect.soft(hendra).toBeDefined();
    expect.soft(hendra.initials).toBe('HW');
    expect.soft(hendra.verified).toBe(true);
    expect.soft(hendra.rating).toBe(5);
    expect.soft(hendra.likes).toBe(7);
    expect.soft(hendra.content).toContain('Pengambilan sampel darah');
  });

  test('ReviewStore adds reviews, toggles likes, and persists state to localStorage', async ({ page }) => {
    // 1. Like a review (first time: increment from 14 to 15)
    await page.evaluate(() => {
      const store = (window as any).__REVIEW_STORE__;
      const firstId = store.getState().reviews[0].id;
      store.getState().likeReview(firstId);
    });

    const likedReview = await page.evaluate(() => {
      return (window as any).__REVIEW_STORE__.getState().reviews[0];
    });
    expect.soft(likedReview.likes).toBe(15);
    expect.soft(likedReview.isLiked).toBe(true);

    // Toggle like off (decrement back to 14)
    await page.evaluate(() => {
      const store = (window as any).__REVIEW_STORE__;
      const firstId = store.getState().reviews[0].id;
      store.getState().likeReview(firstId);
    });
    const unlikedReview = await page.evaluate(() => {
      return (window as any).__REVIEW_STORE__.getState().reviews[0];
    });
    expect.soft(unlikedReview.likes).toBe(14);
    expect.soft(unlikedReview.isLiked).toBe(false);

    // Re-like for persistent storage verification
    await page.evaluate(() => {
      const store = (window as any).__REVIEW_STORE__;
      const firstId = store.getState().reviews[0].id;
      store.getState().likeReview(firstId);
    });

    // 2. Add a new review
    await page.evaluate(() => {
      const store = (window as any).__REVIEW_STORE__;
      store.getState().addReview({
        patientName: 'Ahmad Dahlan',
        rating: 5,
        content: 'Dokter sangat responsif dan penjelasannya mudah dipahami keluarga.',
        category: 'Kunjungan Rumah',
        tags: ['Responsif', 'Profesional'],
        isAnonymous: false,
      });
    });

    const reviews = await page.evaluate(() => {
      return (window as any).__REVIEW_STORE__.getState().reviews;
    });
    expect.soft(reviews.length).toBe(4);
    const added = reviews.find((r: any) => r.patientName === 'Ahmad Dahlan');
    expect.soft(added).toBeDefined();
    expect.soft(added.rating).toBe(5);
    expect.soft(added.initials).toBe('AD');

    // 3. Verify persistence under 'homecare-review-storage'
    const storageItem = await page.evaluate(() => {
      const raw = localStorage.getItem('homecare-review-storage');
      return raw ? JSON.parse(raw) : null;
    });
    expect.soft(storageItem).not.toBeNull();
    expect.soft(storageItem.state.reviews.length).toBe(4);

    // 4. Reload page and verify hydration
    await page.reload();
    const rehydratedReviews = await page.evaluate(() => {
      return (window as any).__REVIEW_STORE__.getState().reviews;
    });
    expect.soft(rehydratedReviews.length).toBe(4);
    expect.soft(rehydratedReviews[1].likes).toBe(15);
    expect.soft(rehydratedReviews[1].isLiked).toBe(true);
  });

  test('Calendar utility generates valid iCalendar RFC 5545 format and triggers download safely', async ({ page }) => {
    const icsResult = await page.evaluate(() => {
      const calendar = (window as any).__CALENDAR__;
      if (!calendar) return null;

      const mockBooking = {
        id: 'BOOK-TEST-123',
        date: '2024-06-25',
        time: '11:00',
        serviceType: 'homecare',
        patientName: 'Budi Santoso (58 thn)',
        patientPhone: '+62 812-8921-4450',
        address: 'Jl. Bintaro Utama Sektor 7, Tangerang Selatan',
        landmark: 'Rumah Pagar Hitam No. 12, seberang Taman',
        coordinates: { lat: -6.2841, lng: 106.7265 },
        complaint: 'Demam tinggi 3 hari, lemas & riwayat hipertensi',
        createdAt: '2024-06-24T10:00:00.000Z',
        status: 'confirmed' as const,
      };

      const ics = calendar.generateIcsContent(mockBooking);

      // Test month and year rollover for late hour appointment
      const yearEndBooking = {
        ...mockBooking,
        id: 'BOOK-YEAR-END',
        date: '2024-12-31',
        time: '23:00',
      };
      const yearEndIcs = calendar.generateIcsContent(yearEndBooking);

      const monthEndBooking = {
        ...mockBooking,
        id: 'BOOK-MONTH-END',
        date: '2024-06-30',
        time: '23:30',
      };
      const monthEndIcs = calendar.generateIcsContent(monthEndBooking);

      // Also safely call downloadIcsFile
      let downloadError = null;
      try {
        calendar.downloadIcsFile(mockBooking);
      } catch (err: any) {
        downloadError = err?.message || String(err);
      }

      return { ics, yearEndIcs, monthEndIcs, downloadError };
    });

    expect(icsResult).not.toBeNull();
    expect.soft(icsResult?.downloadError).toBeNull();

    const ics = icsResult?.ics || '';
    expect.soft(ics).toContain('BEGIN:VCALENDAR');
    expect.soft(ics).toContain('VERSION:2.0');
    expect.soft(ics).toContain('BEGIN:VEVENT');
    expect.soft(ics).toContain('DTSTART:20240625T110000');
    expect.soft(ics).toContain('DTEND:20240625T120000');
    expect.soft(ics).toContain('Budi Santoso');
    expect.soft(ics).toContain('Bintaro Utama');
    expect.soft(ics).toContain('Demam tinggi');
    expect.soft(ics).toContain('STATUS:CONFIRMED');
    expect.soft(ics).toContain('END:VEVENT');
    expect.soft(ics).toContain('END:VCALENDAR');

    // Year-end rollover check: 2024-12-31 23:00 -> 2025-01-01 00:00
    expect.soft(icsResult?.yearEndIcs).toContain('DTSTART:20241231T230000');
    expect.soft(icsResult?.yearEndIcs).toContain('DTEND:20250101T000000');

    // Month-end rollover check: 2024-06-30 23:30 -> 2024-07-01 00:30
    expect.soft(icsResult?.monthEndIcs).toContain('DTSTART:20240630T233000');
    expect.soft(icsResult?.monthEndIcs).toContain('DTEND:20240701T003000');
  });
});

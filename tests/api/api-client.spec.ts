import { test, expect } from '@playwright/test';

test.describe('Task 3: Frontend API Client & Smart Fallback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('fetches availability with smart fallback when running locally', async ({ page }) => {
    const availability = await page.evaluate(async () => {
      const { fetchSlotAvailability } = await import('/src/services/api.ts');
      return await fetchSlotAvailability('2024-06-25');
    });

    expect.soft(Array.isArray(availability)).toBe(true);
  });

  test('submitting a duplicate booking triggers collision detection', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { submitBooking, clearMockBookings } = await import('/src/services/api.ts');
      clearMockBookings();

      const bookingData = {
        date: '2024-06-25',
        time: '11:00',
        serviceType: 'homecare' as const,
        patientName: 'Pasien A',
        patientPhone: '+6281234567890',
        address: 'Jl. Test No. 1',
        complaint: 'Demam',
      };

      const res1 = await submitBooking(bookingData);
      const res2 = await submitBooking(bookingData); // duplicate
      return { res1, res2 };
    });

    expect.soft(result.res1.success).toBe(true);
    expect.soft(result.res2.success).toBe(false);
    expect.soft(result.res2.error).toBe('SLOT_ALREADY_BOOKED');
  });

  test('fetchSlotAvailability reflects newly booked slots in mock fallback', async ({ page }) => {
    const bookedTimes = await page.evaluate(async () => {
      const { submitBooking, fetchSlotAvailability, clearMockBookings } = await import('/src/services/api.ts');
      clearMockBookings();

      await submitBooking({
        date: '2024-06-26',
        time: '14:00',
        patientName: 'Pasien B',
      });

      return await fetchSlotAvailability('2024-06-26');
    });

    expect.soft(bookedTimes).toContain('14:00');
  });
});

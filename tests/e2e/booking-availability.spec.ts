import { test, expect } from '@playwright/test';

test.describe('Task 4: Booking Step 2 Real-time Slot Availability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/booking/langkah-2');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('homecare_d1_mock_bookings');
    });
  });

  test('renders time slot sections and respects booked slots', async ({ page }) => {
    // Seed a booked slot for 2024-06-25 at 09:00
    await page.evaluate(() => {
      localStorage.setItem(
        'homecare_d1_mock_bookings',
        JSON.stringify([
          { id: 'BOOK-TEST-1', date: '2024-06-25', time: '09:00', patientName: 'Test' },
        ])
      );
    });

    // Reload page to trigger availability fetch
    await page.reload();

    const bookedBtn = page.getByTestId('time-slot-09:00');
    await expect.soft(bookedBtn).toBeVisible();
    await expect.soft(bookedBtn).toBeDisabled();
    await expect.soft(bookedBtn).toContainText('Terisi');

    // Available slot 11:00 can be clicked
    const availableBtn = page.getByTestId('time-slot-11:00');
    await expect.soft(availableBtn).toBeEnabled();
    await availableBtn.click();
    await expect.soft(availableBtn).toHaveAttribute('data-active', 'true');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Task 5: Booking Step 3 Concurrency Collision Guard', () => {
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('homecare_d1_mock_bookings');
    });
  });

  test('displays conflict dialog and redirect button when slot collision occurs', async ({ page }) => {
    await page.goto('/booking/langkah-3');

    // Simulate that slot was just taken by someone else right before confirming
    await page.evaluate(() => {
      localStorage.setItem(
        'homecare_d1_mock_bookings',
        JSON.stringify([
          { id: 'COLLISION-1', date: '2024-06-25', time: '11:00', patientName: 'Orang Lain' },
        ])
      );
    });

    // Attempt to confirm the same slot
    const confirmBtn = page.getByTestId('btn-confirm-booking');
    await confirmBtn.click();

    // Conflict dialog should appear
    const conflictModal = page.getByTestId('modal-slot-conflict');
    await expect.soft(conflictModal).toBeVisible();
    await expect.soft(conflictModal).toContainText('Jadwal Sudah Terisi');

    // Button to re-select slot navigates back to Step 2
    const changeSlotBtn = page.getByTestId('btn-reselect-slot');
    await expect.soft(changeSlotBtn).toBeVisible();
    const btnBox = await changeSlotBtn.boundingBox();
    expect.soft(btnBox?.height).toBeGreaterThanOrEqual(44);

    await changeSlotBtn.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);
  });

  test('allows confirmation when slot is available without collision', async ({ page }) => {
    await page.goto('/booking/langkah-3');

    const confirmBtn = page.getByTestId('btn-confirm-booking');
    await confirmBtn.click();

    // Should navigate to confirmation
    await expect.soft(page).toHaveURL(/\/booking\/konfirmasi/);
  });
});

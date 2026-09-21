import { test, expect } from '@playwright/test';

test.describe('Task 5: Layar 3 (Booking Step 1: Tanggal & Jenis Kunjungan)', () => {
  test.beforeEach(async ({ page }) => {
    // Reset or navigate directly to step 1
    await page.goto('/booking/langkah-1');
  });

  test('renders top navigation, stepper step 1 active, and back button navigates to /', async ({ page }) => {
    // Top nav title and back button
    const navBar = page.getByTestId('top-nav-bar');
    await expect.soft(navBar).toBeVisible();
    await expect.soft(page.getByTestId('nav-title')).toHaveText('Pilih Tanggal & Kunjungan');

    const backButton = page.getByTestId('nav-back-button');
    await expect.soft(backButton).toBeVisible();

    // Stepper checks
    const stepper = page.getByTestId('stepper');
    await expect.soft(stepper).toBeVisible();

    const step1 = page.getByTestId('step-1');
    await expect.soft(step1).toHaveAttribute('data-state', 'active');
    await expect.soft(page.getByTestId('step-1-label')).toHaveText('Tanggal');

    const step2 = page.getByTestId('step-2');
    await expect.soft(step2).toHaveAttribute('data-state', 'upcoming');

    // Click back button and verify navigation to home
    await backButton.click();
    await expect.soft(page).toHaveURL('/');
  });

  test('renders mini doctor card with credentials and rating', async ({ page }) => {
    const miniCard = page.getByTestId('mini-doctor-card');
    await expect.soft(miniCard).toBeVisible();

    await expect.soft(page.getByTestId('mini-doctor-avatar')).toBeVisible();
    await expect.soft(page.getByTestId('mini-doctor-name')).toContainText('Corina Wulandari');
    await expect.soft(page.getByTestId('mini-doctor-specialty')).toContainText('Spesialis Penyakit Dalam');
    await expect.soft(page.getByTestId('mini-doctor-rating')).toContainText('4.9');
    await expect.soft(page.getByTestId('mini-doctor-patients')).toContainText('180+');
  });

  test('renders 7-day horizontal calendar, month navigation, and allows selecting date', async ({ page }) => {
    const calendarSection = page.getByTestId('calendar-picker-section');
    await expect.soft(calendarSection).toBeVisible();

    // Month navigation header
    await expect.soft(page.getByTestId('calendar-month-label')).toBeVisible();
    const prevMonthBtn = page.getByTestId('btn-prev-month');
    const nextMonthBtn = page.getByTestId('btn-next-month');
    await expect.soft(prevMonthBtn).toBeVisible();
    await expect.soft(nextMonthBtn).toBeVisible();

    const prevBox = await prevMonthBtn.boundingBox();
    expect.soft(prevBox?.width).toBeGreaterThanOrEqual(44);
    expect.soft(prevBox?.height).toBeGreaterThanOrEqual(44);

    const nextBox = await nextMonthBtn.boundingBox();
    expect.soft(nextBox?.width).toBeGreaterThanOrEqual(44);
    expect.soft(nextBox?.height).toBeGreaterThanOrEqual(44);

    // 7 day buttons
    const dayButtons = page.locator('[data-testid^="calendar-day-"]');
    await expect.soft(dayButtons).toHaveCount(7);

    // Initial default date 2024-06-25 should be selected or have active state
    const selectedDateSummary = page.getByTestId('selected-date-summary');
    await expect.soft(selectedDateSummary).toBeVisible();
    await expect.soft(selectedDateSummary).toContainText('Tanggal Kunjungan Terpilih');
    await expect.soft(selectedDateSummary).toContainText('2024');

    // Select another day
    const thirdDay = dayButtons.nth(2);
    await thirdDay.click();
    await expect.soft(thirdDay).toHaveAttribute('data-active', 'true');
  });

  test('renders service type radio cards with default homecare and toggles selection', async ({ page }) => {
    const homecareOption = page.getByTestId('service-type-homecare');
    const teleconsultOption = page.getByTestId('service-type-teleconsultation');

    await expect.soft(homecareOption).toBeVisible();
    await expect.soft(teleconsultOption).toBeVisible();

    // Check homecare option content and default selection
    await expect.soft(homecareOption).toContainText('Kunjungan Dokter ke Rumah');
    await expect.soft(homecareOption).toContainText('Tangerang Selatan');
    await expect.soft(homecareOption).toHaveAttribute('data-checked', 'true');

    // Teleconsultation details
    await expect.soft(teleconsultOption).toContainText('Telekonsultasi Video');
    await expect.soft(teleconsultOption).toHaveAttribute('data-checked', 'false');

    // Select teleconsultation
    await teleconsultOption.click();
    await expect.soft(teleconsultOption).toHaveAttribute('data-checked', 'true');
    await expect.soft(homecareOption).toHaveAttribute('data-checked', 'false');
  });

  test('sticky CTA button saves step 1 selections to store and navigates to step 2', async ({ page }) => {
    const ctaButton = page.getByTestId('btn-next-step-1');
    await expect.soft(ctaButton).toBeVisible();
    await expect.soft(ctaButton).toContainText('Lanjut Pilih Jam Kunjungan');

    // Click CTA button
    await ctaButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);
  });
});

test.describe('Task 5: Layar 4 (Booking Step 2: Jam Kunjungan)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/booking/langkah-2');
  });

  test('renders top navigation, stepper step 2 active (step 1 completed), and back button navigates to step 1', async ({ page }) => {
    const navBar = page.getByTestId('top-nav-bar');
    await expect.soft(navBar).toBeVisible();
    await expect.soft(page.getByTestId('nav-title')).toHaveText('Buat Janji Temu');

    const backButton = page.getByTestId('nav-back-button');
    await expect.soft(backButton).toBeVisible();

    // Stepper checks
    const step1 = page.getByTestId('step-1');
    await expect.soft(step1).toHaveAttribute('data-state', 'completed');

    const step2 = page.getByTestId('step-2');
    await expect.soft(step2).toHaveAttribute('data-state', 'active');
    await expect.soft(page.getByTestId('step-2-label')).toHaveText('Waktu');

    const step3 = page.getByTestId('step-3');
    await expect.soft(step3).toHaveAttribute('data-state', 'upcoming');

    // Click back button and verify navigation to step 1
    await backButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
  });

  test('renders selected date banner with Ubah button navigating to step 1', async ({ page }) => {
    const banner = page.getByTestId('selected-date-banner');
    await expect.soft(banner).toBeVisible();
    await expect.soft(banner).toContainText('TANGGAL KUNJUNGAN');
    await expect.soft(banner).toContainText('2024');

    const btnUbah = page.getByTestId('btn-ubah-tanggal');
    await expect.soft(btnUbah).toBeVisible();
    await expect.soft(btnUbah).toContainText('Ubah');

    const ubahBox = await btnUbah.boundingBox();
    expect.soft(ubahBox?.height).toBeGreaterThanOrEqual(44);

    await btnUbah.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
  });

  test('renders time slot sections with tactile buttons and allows slot selection', async ({ page }) => {
    // Time groups
    await expect.soft(page.getByTestId('time-group-pagi')).toBeVisible();
    await expect.soft(page.getByTestId('time-group-siang')).toBeVisible();
    await expect.soft(page.getByTestId('time-group-sore-malam')).toBeVisible();

    // Default time 11:00 should be active
    const slot11 = page.getByTestId('time-slot-11:00');
    await expect.soft(slot11).toBeVisible();
    await expect.soft(slot11).toHaveAttribute('data-active', 'true');

    // Slot 09:00 touch target minimum 44px
    const slot09 = page.getByTestId('time-slot-09:00');
    await expect.soft(slot09).toBeVisible();
    const box09 = await slot09.boundingBox();
    expect.soft(box09?.height).toBeGreaterThanOrEqual(44);

    // Select 14:00 slot
    const slot14 = page.getByTestId('time-slot-14:00');
    await expect.soft(slot14).toBeVisible();
    await slot14.click();
    await expect.soft(slot14).toHaveAttribute('data-active', 'true');
    await expect.soft(slot11).toHaveAttribute('data-active', 'false');
  });

  test('renders sterile medical equipment notice banner', async ({ page }) => {
    const notice = page.getByTestId('medical-notice-banner');
    await expect.soft(notice).toBeVisible();
    await expect.soft(notice).toContainText('Waktu Indonesia Barat (WIB)');
    await expect.soft(notice).toContainText('peralatan medis steril');
  });

  test('sticky CTA button saves selected time and navigates to step 3', async ({ page }) => {
    const ctaButton = page.getByTestId('btn-next-step-2');
    await expect.soft(ctaButton).toBeVisible();
    await expect.soft(ctaButton).toContainText('Lanjut ke Data Pasien');

    await ctaButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-3/);
  });
});

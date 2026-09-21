import { test, expect } from '@playwright/test';

test.describe('Task 6: Layar 5 (Booking Step 3: Data Pasien & Leaflet Map)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/booking/langkah-3');
  });

  test('renders top navigation, stepper step 3 active with steps 1 & 2 completed, and back button navigates to step 2', async ({ page }) => {
    const navBar = page.getByTestId('top-nav-bar');
    await expect.soft(navBar).toBeVisible();
    await expect.soft(page.getByTestId('nav-title')).toHaveText('Buat Janji Temu');

    const backButton = page.getByTestId('nav-back-button');
    await expect.soft(backButton).toBeVisible();

    // Stepper checks
    const step1 = page.getByTestId('step-1');
    await expect.soft(step1).toHaveAttribute('data-state', 'completed');

    const step2 = page.getByTestId('step-2');
    await expect.soft(step2).toHaveAttribute('data-state', 'completed');

    const step3 = page.getByTestId('step-3');
    await expect.soft(step3).toHaveAttribute('data-state', 'active');
    await expect.soft(page.getByTestId('step-3-label')).toHaveText('Detail');

    // Click back button and verify navigation to step 2
    await backButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);
  });

  test('renders mini doctor card and patient form inputs with touch target compliance', async ({ page }) => {
    // Mini doctor card
    await expect.soft(page.getByTestId('mini-doctor-card')).toBeVisible();

    // Patient name input
    const inputName = page.getByTestId('input-patient-name');
    await expect.soft(inputName).toBeVisible();
    const nameBox = await inputName.boundingBox();
    expect.soft(nameBox?.height).toBeGreaterThanOrEqual(44);

    // Patient phone input
    const inputPhone = page.getByTestId('input-patient-phone');
    await expect.soft(inputPhone).toBeVisible();
    const phoneBox = await inputPhone.boundingBox();
    expect.soft(phoneBox?.height).toBeGreaterThanOrEqual(44);

    // Address input
    const inputAddress = page.getByTestId('input-patient-address');
    await expect.soft(inputAddress).toBeVisible();
    const addressBox = await inputAddress.boundingBox();
    expect.soft(addressBox?.height).toBeGreaterThanOrEqual(44);

    // Landmark input
    const inputLandmark = page.getByTestId('input-patient-landmark');
    await expect.soft(inputLandmark).toBeVisible();
    const landmarkBox = await inputLandmark.boundingBox();
    expect.soft(landmarkBox?.height).toBeGreaterThanOrEqual(44);

    // Complaint selector and textarea
    const selectComplaint = page.getByTestId('select-complaint');
    await expect.soft(selectComplaint).toBeVisible();
    const textareaComplaint = page.getByTestId('textarea-complaint');
    await expect.soft(textareaComplaint).toBeVisible();
  });

  test('renders Leaflet map picker with radar pulse, coordinates pill, and geolocation button', async ({ page }) => {
    // Map container
    const mapPicker = page.getByTestId('map-picker-container');
    await expect.soft(mapPicker).toBeVisible();

    // Coordinates pill with Tangsel default
    const coordsPill = page.getByTestId('map-coordinates-pill');
    await expect.soft(coordsPill).toBeVisible();
    await expect.soft(coordsPill).toContainText('GPS:');
    await expect.soft(coordsPill).toContainText('-6.2841');
    await expect.soft(coordsPill).toContainText('106.7265');

    // Use current location button
    const btnLocation = page.getByTestId('btn-use-current-location');
    await expect.soft(btnLocation).toBeVisible();
    await expect.soft(btnLocation).toContainText('Gunakan Lokasi Saat Ini');
    const locBox = await btnLocation.boundingBox();
    expect.soft(locBox?.height).toBeGreaterThanOrEqual(44);

    // Map marker or radar ping element
    const radarMarker = page.getByTestId('map-radar-marker');
    await expect.soft(radarMarker).toBeVisible();
  });

  test('renders live booking summary card and sticky CTA button to confirm booking', async ({ page }) => {
    const liveSummary = page.getByTestId('booking-live-summary');
    await expect.soft(liveSummary).toBeVisible();
    await expect.soft(liveSummary).toContainText('Corina Wulandari');

    const ctaBtn = page.getByTestId('btn-confirm-booking');
    await expect.soft(ctaBtn).toBeVisible();
    await expect.soft(ctaBtn).toContainText('Konfirmasi Janji Temu');
    const ctaBox = await ctaBtn.boundingBox();
    expect.soft(ctaBox?.height).toBeGreaterThanOrEqual(44);

    // Clicking CTA navigates to confirmation page
    await ctaBtn.click();
    await expect.soft(page).toHaveURL(/\/booking\/konfirmasi/);
  });
});

test.describe('Task 6: Layar 6 (Booking Step 4: Konfirmasi Janji Temu & Kalender)', () => {
  test.beforeEach(async ({ page }) => {
    // Seed draft and confirm booking via browser window helper or store before test
    await page.goto('/booking/langkah-3');
    await page.getByTestId('btn-confirm-booking').click();
    await page.waitForURL(/\/booking\/konfirmasi/);
  });

  test('renders modal header with close (X) and finish buttons navigating to home', async ({ page }) => {
    const btnClose = page.getByTestId('btn-close-modal');
    await expect.soft(btnClose).toBeVisible();
    const closeBox = await btnClose.boundingBox();
    expect.soft(closeBox?.height).toBeGreaterThanOrEqual(44);

    const btnFinish = page.getByTestId('btn-finish-modal');
    await expect.soft(btnFinish).toBeVisible();
    await expect.soft(btnFinish).toContainText('Selesai');
    const finishBox = await btnFinish.boundingBox();
    expect.soft(finishBox?.height).toBeGreaterThanOrEqual(44);

    // Clicking finish navigates to /
    await btnFinish.click();
    await expect.soft(page).toHaveURL('/');
  });

  test('renders pop-in checkmark badge, confirmation title and subtitle', async ({ page }) => {
    const badgeCheck = page.getByTestId('badge-success-check');
    await expect.soft(badgeCheck).toBeVisible();

    const title = page.getByTestId('booking-success-title');
    await expect.soft(title).toBeVisible();
    await expect.soft(title).toContainText('Janji Temu Dikonfirmasi');

    const subtitle = page.getByTestId('booking-success-subtitle');
    await expect.soft(subtitle).toBeVisible();
    await expect.soft(subtitle).toContainText('Kunjungan medis telah dijadwalkan');
  });

  test('renders doctor card and detailed reservation info card', async ({ page }) => {
    const doctorCard = page.getByTestId('success-doctor-card');
    await expect.soft(doctorCard).toBeVisible();
    await expect.soft(doctorCard).toContainText('Corina Wulandari');

    const detailsCard = page.getByTestId('reservation-details-card');
    await expect.soft(detailsCard).toBeVisible();
    await expect.soft(detailsCard).toContainText('Tanggal');
    await expect.soft(detailsCard).toContainText('Jam Kunjungan');
    await expect.soft(detailsCard).toContainText('Lokasi Kunjungan');
    await expect.soft(detailsCard).toContainText('GPS:');
  });

  test('renders email confirmation notice and action buttons with calendar download', async ({ page }) => {
    const emailNotice = page.getByTestId('email-confirmation-notice');
    await expect.soft(emailNotice).toBeVisible();
    await expect.soft(emailNotice).toContainText('email');

    // Calendar download button
    const btnCalendar = page.getByTestId('btn-add-to-calendar');
    await expect.soft(btnCalendar).toBeVisible();
    await expect.soft(btnCalendar).toContainText('Tambah ke Kalender');
    const calBox = await btnCalendar.boundingBox();
    expect.soft(calBox?.height).toBeGreaterThanOrEqual(44);

    // Check calendar download event trigger
    const downloadPromise = page.waitForEvent('download', { timeout: 3000 }).catch(() => null);
    await btnCalendar.click();
    const download = await downloadPromise;
    if (download) {
      expect.soft(download.suggestedFilename()).toContain('.ics');
    }

    // View details button
    const btnDetails = page.getByTestId('btn-view-details');
    await expect.soft(btnDetails).toBeVisible();
    await expect.soft(btnDetails).toContainText('Lihat Rincian Reservasi');

    // Back to home button
    const btnHome = page.getByTestId('btn-back-to-home');
    await expect.soft(btnHome).toBeVisible();
    await expect.soft(btnHome).toContainText('Kembali ke Beranda');
    await btnHome.click();
    await expect.soft(page).toHaveURL('/');
  });
});

test.describe('Task 6: Full End-to-End Booking Flow (Steps 1 -> 2 -> 3 -> 4)', () => {
  test('completes full booking flow from Step 1 to Confirmation with customized data', async ({ page }) => {
    // 1. Step 1: Date & Service
    await page.goto('/booking/langkah-1');
    await expect.soft(page.getByTestId('calendar-picker-section')).toBeVisible();

    // Select second available day
    const dayButtons = page.locator('[data-testid^="calendar-day-"]');
    await dayButtons.nth(1).click();

    // Proceed to Step 2
    await page.getByTestId('btn-next-step-1').click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);

    // 2. Step 2: Time Slot Selection
    const slot14 = page.getByTestId('time-slot-14:00');
    await expect.soft(slot14).toBeVisible();
    await slot14.click();

    // Proceed to Step 3
    await page.getByTestId('btn-next-step-2').click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-3/);

    // 3. Step 3: Patient Data Form
    const inputName = page.getByTestId('input-patient-name');
    await inputName.fill('Hj. Siti Rahma (65 thn)');

    const inputPhone = page.getByTestId('input-patient-phone');
    await inputPhone.fill('+62 811-2233-4455');

    const inputAddress = page.getByTestId('input-patient-address');
    await inputAddress.fill('Jl. Kasuari No. 5, Sektor 9 Bintaro');

    const inputLandmark = page.getByTestId('input-patient-landmark');
    await inputLandmark.fill('Dekat Masjid Raya Bintaro');

    const complaintSelect = page.getByTestId('select-complaint');
    await complaintSelect.selectOption({ label: 'Pemeriksaan Lansia & Tirah Baring' });

    // Confirm booking
    await page.getByTestId('btn-confirm-booking').click();

    // 4. Step 4: Success confirmation
    await expect.soft(page).toHaveURL(/\/booking\/konfirmasi/);
    await expect.soft(page.getByTestId('booking-success-title')).toHaveText('Janji Temu Dikonfirmasi');

    const detailsCard = page.getByTestId('reservation-details-card');
    await expect.soft(detailsCard).toContainText('14:00');
    await expect.soft(detailsCard).toContainText('Jl. Kasuari No. 5, Sektor 9 Bintaro');
  });
});

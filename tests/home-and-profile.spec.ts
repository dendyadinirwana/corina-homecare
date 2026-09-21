import { test, expect } from '@playwright/test';

test.describe('Task 4: Layar 1 (Beranda & Bio-Link Hub)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders status pill, avatar, doctor credentials, and experience badges', async ({ page }) => {
    // Status pill
    const statusPill = page.getByTestId('status-pill');
    await expect.soft(statusPill).toBeVisible();
    await expect.soft(statusPill).toContainText('Menerima Kunjungan Hari Ini');
    await expect.soft(statusPill).toContainText('Tiba 30 Menit');
    await expect.soft(page.getByTestId('status-green-dot')).toBeVisible();

    // Doctor Avatar
    const avatar = page.getByTestId('doctor-avatar');
    await expect.soft(avatar).toBeVisible();

    // Doctor Name, Specialty, and Registration
    const doctorName = page.getByTestId('doctor-name');
    await expect.soft(doctorName).toHaveText('Corina Wulandari');

    const doctorSpecialty = page.getByTestId('doctor-specialty');
    await expect.soft(doctorSpecialty).toContainText('Dokter Spesialis Penyakit Dalam & Layanan Homecare');

    const doctorRegistration = page.getByTestId('doctor-registration');
    await expect.soft(doctorRegistration).toContainText('SIP No. 446.1/1082/SIP.D/2022 • IDI Tangerang Selatan');

    // Experience badges
    const badgeFk = page.getByTestId('badge-fk');
    await expect.soft(badgeFk).toContainText('FK UI / Sp.PD');
    const fkBox = await badgeFk.boundingBox();
    expect.soft(fkBox?.height).toBeGreaterThanOrEqual(44);

    const badgeExp = page.getByTestId('badge-experience');
    await expect.soft(badgeExp).toContainText('10+ Thn Pengalaman');
    const expBox = await badgeExp.boundingBox();
    expect.soft(expBox?.height).toBeGreaterThanOrEqual(44);

    const badgeRating = page.getByTestId('badge-rating');
    await expect.soft(badgeRating).toContainText('4.9');
    await expect.soft(badgeRating).toContainText('180+ Pasien');
    const ratingBox = await badgeRating.boundingBox();
    expect.soft(ratingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('clicking profile badge navigates to /profil', async ({ page }) => {
    const badgeFk = page.getByTestId('badge-fk');
    await badgeFk.click();
    await expect.soft(page).toHaveURL(/\/profil/);
  });

  test('renders emergency WhatsApp card with active status and correct link', async ({ page }) => {
    const waCard = page.getByTestId('whatsapp-emergency-card');
    await expect.soft(waCard).toBeVisible();
    await expect.soft(waCard).toContainText('Chat Dokter (WhatsApp)');
    await expect.soft(waCard).toContainText('Respon cepat • Siaga 24 jam');
    await expect.soft(waCard).toContainText('Aktif');

    // Check WhatsApp href
    const waLink = page.getByTestId('whatsapp-link');
    await expect.soft(waLink).toHaveAttribute('href', /wa\.me\/6281234567890/);
  });

  test('renders 4 service cards and Pesan button navigates to /booking/langkah-1', async ({ page }) => {
    // 4 action cards
    const cardHomecare = page.getByTestId('service-card-kunjungan-rumah');
    await expect.soft(cardHomecare).toBeVisible();
    await expect.soft(cardHomecare).toContainText('Kunjungan Rumah');
    await expect.soft(cardHomecare).toContainText('Pemeriksaan umum & resep');

    const cardElderly = page.getByTestId('service-card-lansia');
    await expect.soft(cardElderly).toBeVisible();
    await expect.soft(cardElderly).toContainText('Pemeriksaan Lansia & Kronis');
    await expect.soft(cardElderly).toContainText('Cek tensi, gula darah & rekam jantung');

    const cardLab = page.getByTestId('service-card-lab');
    await expect.soft(cardLab).toBeVisible();
    await expect.soft(cardLab).toContainText('Pengambilan Darah & Lab');
    await expect.soft(cardLab).toContainText('Sampel di rumah, hasil digital cepat');

    const cardWound = page.getByTestId('service-card-perawatan-luka');
    await expect.soft(cardWound).toBeVisible();
    await expect.soft(cardWound).toContainText('Perawatan Luka & Jahitan');
    await expect.soft(cardWound).toContainText('Ganti perban steril & lepas benang');

    // Footnote
    const footnote = page.getByTestId('domisili-footnote');
    await expect.soft(footnote).toContainText('Domisili & Wilayah Kunjungan: Tangerang Selatan & Sekitarnya');

    // Button Pesan in Card 1
    const orderButton = page.getByTestId('btn-pesan-kunjungan');
    await expect.soft(orderButton).toBeVisible();
    await orderButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
  });

  test('service cards are accessible via keyboard navigation', async ({ page }) => {
    const cardElderly = page.getByTestId('service-card-lansia');
    await expect.soft(cardElderly).toHaveAttribute('role', 'button');
    await expect.soft(cardElderly).toHaveAttribute('tabindex', '0');

    await cardElderly.focus();
    await page.keyboard.press('Enter');
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
  });
});

test.describe('Task 4: Layar 2 (Profil & Detail Klinis Dokter)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profil');
  });

  test('renders hero photo, top navigation buttons, and back button navigates to /', async ({ page }) => {
    const heroImage = page.getByTestId('profile-hero-image');
    await expect.soft(heroImage).toBeVisible();

    const backButton = page.getByTestId('btn-back');
    await expect.soft(backButton).toBeVisible();

    const favButton = page.getByTestId('btn-favorite');
    await expect.soft(favButton).toBeVisible();

    const moreButton = page.getByTestId('btn-more');
    await expect.soft(moreButton).toBeVisible();

    // Click back button
    await backButton.click();
    await expect.soft(page).toHaveURL('/');
  });

  test('renders contact pills with valid links and min 44px touch targets', async ({ page }) => {
    const pillTel = page.getByTestId('contact-pill-phone');
    await expect.soft(pillTel).toContainText('0812-3456-7890');
    await expect.soft(pillTel).toHaveAttribute('href', /tel:081234567890/);
    const telBox = await pillTel.boundingBox();
    expect.soft(telBox?.height).toBeGreaterThanOrEqual(44);

    const pillMail = page.getByTestId('contact-pill-email');
    await expect.soft(pillMail).toContainText('corina@healthrate.id');
    await expect.soft(pillMail).toHaveAttribute('href', /mailto:corina@healthrate\.id/);
    const mailBox = await pillMail.boundingBox();
    expect.soft(mailBox?.height).toBeGreaterThanOrEqual(44);

    const pillLoc = page.getByTestId('contact-pill-location');
    await expect.soft(pillLoc).toContainText('Tangerang Selatan');
    const locBox = await pillLoc.boundingBox();
    expect.soft(locBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('renders rating link, review link, and AI summary box', async ({ page }) => {
    const ratingBadge = page.getByTestId('profile-rating-badge');
    await expect.soft(ratingBadge).toBeVisible();
    await expect.soft(ratingBadge).toContainText('4.8');
    await expect.soft(ratingBadge).toContainText('38 ulasan');
    await expect.soft(ratingBadge).toHaveAttribute('href', '/ulasan');

    const writeReviewLink = page.getByTestId('link-tulis-ulasan');
    await expect.soft(writeReviewLink).toBeVisible();
    await expect.soft(writeReviewLink).toHaveAttribute('href', '/ulasan/tulis');

    const aiSummary = page.getByTestId('ai-summary-box');
    await expect.soft(aiSummary).toBeVisible();
    await expect.soft(aiSummary).toContainText('Ringkasan ulasan kepuasan pasien');
  });

  test('renders 3 clinical metric cards with star ratings', async ({ page }) => {
    const metricWait = page.getByTestId('metric-waktu-tunggu');
    await expect.soft(metricWait).toContainText('Waktu Tunggu');
    await expect.soft(metricWait).toContainText('4.63');

    const metricEmpathy = page.getByTestId('metric-sikap-empati');
    await expect.soft(metricEmpathy).toContainText('Sikap & Empati');
    await expect.soft(metricEmpathy).toContainText('4.19');

    const metricExplanation = page.getByTestId('metric-penjelasan');
    await expect.soft(metricExplanation).toContainText('Penjelasan');
    await expect.soft(metricExplanation).toContainText('4.74');
  });

  test('renders visit reasons donut chart and professional activity progress bar', async ({ page }) => {
    const donutChart = page.getByTestId('donut-chart');
    await expect.soft(donutChart).toBeVisible();

    const chartLegend = page.getByTestId('donut-chart-legend');
    await expect.soft(chartLegend).toContainText('Hipertensi');
    await expect.soft(chartLegend).toContainText('35%');
    await expect.soft(chartLegend).toContainText('Kardiologi');
    await expect.soft(chartLegend).toContainText('25%');
    await expect.soft(chartLegend).toContainText('Gagal Jantung');
    await expect.soft(chartLegend).toContainText('22%');
    await expect.soft(chartLegend).toContainText('Nyeri Dada');
    await expect.soft(chartLegend).toContainText('18%');

    const activityBar = page.getByTestId('professional-activity-bar');
    await expect.soft(activityBar).toBeVisible();
    await expect.soft(activityBar).toContainText('Klinis');
    await expect.soft(activityBar).toContainText('47%');
    await expect.soft(activityBar).toContainText('Riset');
    await expect.soft(activityBar).toContainText('24%');
  });

  test('renders sticky consultation fee footer and button navigates to /booking/langkah-1', async ({ page }) => {
    const footer = page.getByTestId('sticky-booking-footer');
    await expect.soft(footer).toBeVisible();
    await expect.soft(footer).toHaveClass(/sticky/);
    await expect.soft(footer).toContainText('Rp 250.000');
    await expect.soft(footer).toContainText('Biaya konsultasi');

    const ctaButton = page.getByTestId('btn-jadwalkan-kunjungan');
    await expect.soft(ctaButton).toBeVisible();
    await expect.soft(ctaButton).toContainText('Jadwalkan Kunjungan');

    await ctaButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
  });
});

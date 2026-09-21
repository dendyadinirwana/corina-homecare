import { test, expect } from '@playwright/test';

test.describe('Task 7: Layar 7 & 8 (Daftar Ulasan Pasien & Formulir Tulis Ulasan)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to reviews page
    await page.goto('/ulasan');
  });

  test('Layar 7: renders aggregate score, rating bars, 3 aspect cards, filter pills, and review list', async ({ page }) => {
    // Top Navigation
    const navBar = page.getByTestId('top-nav-bar');
    await expect.soft(navBar).toBeVisible();
    await expect.soft(page.getByTestId('nav-title')).toHaveText('Ulasan Pasien');

    // Aggregate rating card
    const aggregateCard = page.getByTestId('aggregate-rating-card');
    await expect.soft(aggregateCard).toBeVisible();
    await expect.soft(page.getByTestId('aggregate-score')).toContainText('4.9');
    await expect.soft(page.getByTestId('total-reviews-count')).toContainText('128');
    await expect.soft(page.getByTestId('satisfaction-badge')).toContainText('99% Puas');
    await expect.soft(page.getByTestId('rating-bars')).toBeVisible();

    // 3 Aspect Metric Cards
    const aspectPunctuality = page.getByTestId('aspect-punctuality');
    await expect.soft(aspectPunctuality).toBeVisible();
    await expect.soft(aspectPunctuality).toContainText('Ketepatan Waktu');
    await expect.soft(aspectPunctuality).toContainText('4.8');
    const punctualityBox = await aspectPunctuality.boundingBox();
    expect.soft(punctualityBox?.height).toBeGreaterThanOrEqual(44);

    const aspectEmpathy = page.getByTestId('aspect-empathy');
    await expect.soft(aspectEmpathy).toBeVisible();
    await expect.soft(aspectEmpathy).toContainText('Sikap & Empati');
    await expect.soft(aspectEmpathy).toContainText('4.9');
    const empathyBox = await aspectEmpathy.boundingBox();
    expect.soft(empathyBox?.height).toBeGreaterThanOrEqual(44);

    const aspectExplanation = page.getByTestId('aspect-explanation');
    await expect.soft(aspectExplanation).toBeVisible();
    await expect.soft(aspectExplanation).toContainText('Penjelasan Medis');
    await expect.soft(aspectExplanation).toContainText('4.9');
    const explanationBox = await aspectExplanation.boundingBox();
    expect.soft(explanationBox?.height).toBeGreaterThanOrEqual(44);

    // Filter pills
    const pillSemua = page.getByTestId('filter-pill-semua');
    const pillKunjungan = page.getByTestId('filter-pill-kunjungan-rumah');
    const pillLansia = page.getByTestId('filter-pill-rawat-lansia');
    const pillLab = page.getByTestId('filter-pill-cek-lab');

    await expect.soft(pillSemua).toBeVisible();
    await expect.soft(pillKunjungan).toBeVisible();
    await expect.soft(pillLansia).toBeVisible();
    await expect.soft(pillLab).toBeVisible();

    // Filter pill touch targets
    const pillSemuaBox = await pillSemua.boundingBox();
    expect.soft(pillSemuaBox?.height).toBeGreaterThanOrEqual(44);

    // Initial reviews visible
    await expect.soft(page.getByText('Siti Rahmawati')).toBeVisible();
    await expect.soft(page.getByText('Bambang Sudirgo')).toBeVisible();
    await expect.soft(page.getByText('dr. Hendra Wijaya')).toBeVisible();

    // Filter by Rawat Lansia
    await pillLansia.click();
    await expect.soft(page.getByText('Bambang Sudirgo')).toBeVisible();
    await expect.soft(page.getByText('Siti Rahmawati')).not.toBeVisible();
    await expect.soft(page.getByText('dr. Hendra Wijaya')).not.toBeVisible();

    // Reset filter to Semua
    await pillSemua.click();
    await expect.soft(page.getByText('Siti Rahmawati')).toBeVisible();
    await expect.soft(page.getByText('Bambang Sudirgo')).toBeVisible();

    // Sticky write review button touch target
    const btnWrite = page.getByTestId('btn-write-review');
    await expect.soft(btnWrite).toBeVisible();
    const btnWriteBox = await btnWrite.boundingBox();
    expect.soft(btnWriteBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('Layar 7: toggling like button increments and decrements helpful count', async ({ page }) => {
    const likeBtn = page.getByTestId('btn-like-rev-1');
    await expect.soft(likeBtn).toBeVisible();
    await expect.soft(likeBtn).toContainText('14');

    // Click to like
    await likeBtn.click();
    await expect.soft(likeBtn).toContainText('15');

    // Click again to unlike
    await likeBtn.click();
    await expect.soft(likeBtn).toContainText('14');
  });

  test('Layar 7 to 8 navigation: clicking Tulis Ulasan navigates to /ulasan/tulis', async ({ page }) => {
    const btnWrite = page.getByTestId('btn-write-review');
    await btnWrite.click();
    await expect.soft(page).toHaveURL(/\/ulasan\/tulis/);
  });

  test('Layar 8: renders write review modal elements with touch targets', async ({ page }) => {
    await page.goto('/ulasan/tulis');

    // Modal sheet header
    const btnClose = page.getByTestId('btn-close-modal');
    await expect.soft(btnClose).toBeVisible();
    const closeBox = await btnClose.boundingBox();
    expect.soft(closeBox?.height).toBeGreaterThanOrEqual(44);
    expect.soft(closeBox?.width).toBeGreaterThanOrEqual(44);

    await expect.soft(page.getByTestId('modal-title')).toHaveText('Tulis Ulasan Layanan');

    const linkBantuan = page.getByTestId('link-bantuan');
    await expect.soft(linkBantuan).toBeVisible();
    const bantuanBox = await linkBantuan.boundingBox();
    expect.soft(bantuanBox?.height).toBeGreaterThanOrEqual(44);

    // Completed visit summary card
    const visitCard = page.getByTestId('visit-summary-card');
    await expect.soft(visitCard).toBeVisible();
    await expect.soft(visitCard).toContainText('Corina Wulandari');
    await expect.soft(visitCard).toContainText('Kunjungan Medis ke Rumah');
    await expect.soft(visitCard).toContainText('25 Juni 2024');
    await expect.soft(visitCard).toContainText('Kunjungan Selesai');

    // Main star rating and dynamic feedback badge
    const mainRating = page.getByTestId('main-star-rating');
    await expect.soft(mainRating).toBeVisible();
    const feedbackBadge = page.getByTestId('feedback-badge');
    await expect.soft(feedbackBadge).toBeVisible();

    // 3 sub-aspect ratings
    await expect.soft(page.getByTestId('sub-rating-punctuality')).toBeVisible();
    await expect.soft(page.getByTestId('sub-rating-hygiene')).toBeVisible();
    await expect.soft(page.getByTestId('sub-rating-friendliness')).toBeVisible();

    // Character counter & textarea
    const charCounter = page.getByTestId('char-counter');
    await expect.soft(charCounter).toBeVisible();
    await expect.soft(charCounter).toContainText('0/500');

    const textarea = page.getByTestId('textarea-review-comment');
    await expect.soft(textarea).toBeVisible();

    // Anonymous toggle switch
    const switchAnon = page.getByTestId('switch-anonymous');
    await expect.soft(switchAnon).toBeVisible();

    // Submit CTA button touch target
    const btnSubmit = page.getByTestId('btn-submit-review');
    await expect.soft(btnSubmit).toBeVisible();
    const submitBox = await btnSubmit.boundingBox();
    expect.soft(submitBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('Layar 8: interactive stars update dynamic feedback badge and star value', async ({ page }) => {
    await page.goto('/ulasan/tulis');

    const mainRating = page.getByTestId('main-star-rating');
    const feedbackBadge = page.getByTestId('feedback-badge');

    // Click 4 stars
    const star4 = mainRating.getByTestId('star-4');
    await star4.click();
    await expect.soft(feedbackBadge).toContainText('4.0');
    await expect.soft(feedbackBadge).toContainText('Puas');

    // Click 5 stars
    const star5 = mainRating.getByTestId('star-5');
    await star5.click();
    await expect.soft(feedbackBadge).toContainText('5.0');
    await expect.soft(feedbackBadge).toContainText('Sangat Puas');
  });

  test('Complete flow: write anonymous review, submit, and verify it appears at top of /ulasan', async ({ page }) => {
    await page.goto('/ulasan/tulis');

    // Select 5 stars
    const star5 = page.getByTestId('main-star-rating').getByTestId('star-5');
    await star5.click();

    // Type experience comment
    const testComment = 'Pelayanan dokter sangat profesional, datang tepat waktu, dan sangat sabar merawat lansia.';
    const textarea = page.getByTestId('textarea-review-comment');
    await textarea.fill(testComment);

    const charCounter = page.getByTestId('char-counter');
    await expect.soft(charCounter).toContainText(`${testComment.length}/500`);

    // Enable anonymous switch
    const switchAnon = page.getByTestId('switch-anonymous');
    await switchAnon.click();

    // Submit review
    const btnSubmit = page.getByTestId('btn-submit-review');
    await btnSubmit.click();

    // Should redirect to /ulasan
    await expect.soft(page).toHaveURL(/\/ulasan$/);

    // Verify newly added review appears at top of feed
    const firstReview = page.getByTestId('review-card').first();
    await expect.soft(firstReview).toBeVisible();
    await expect.soft(firstReview).toContainText('Pasien Anonim');
    await expect.soft(firstReview).toContainText('PA');
    await expect.soft(firstReview).toContainText(testComment);
    await expect.soft(firstReview).toContainText('Baru saja');
  });
});

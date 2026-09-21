import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';
import { BookingPage } from './pages/booking-page';
import { ReviewPage } from './pages/review-page';

test.describe('Task 8: Full Navigation Orchestration & Responsiveness', () => {
  let homePage: HomePage;
  let bookingPage: BookingPage;
  let reviewPage: ReviewPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    bookingPage = new BookingPage(page);
    reviewPage = new ReviewPage(page);
  });

  test('all 8 application routes render properly without unhandled runtime errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // Route 1: Home Portal (/)
    await homePage.goto();
    await expect.soft(page).toHaveURL('/');
    await expect.soft(homePage.statusPill).toBeVisible();
    await expect.soft(homePage.doctorName).toHaveText('Corina Wulandari');
    await expect.soft(homePage.orderButton).toBeVisible();

    // Route 2: Doctor Profile (/profil)
    await homePage.gotoProfile();
    await expect.soft(page).toHaveURL(/\/profil/);
    await expect.soft(homePage.profileHeroImage).toBeVisible();
    await expect.soft(homePage.profileScheduleButton).toBeVisible();

    // Route 3: Booking Step 1 (/booking/langkah-1)
    await bookingPage.gotoStep1();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);
    await expect.soft(bookingPage.step1).toHaveAttribute('data-state', 'active');
    await expect.soft(bookingPage.calendarSection).toBeVisible();
    await expect.soft(bookingPage.step1CtaButton).toBeVisible();

    // Route 4: Booking Step 2 (/booking/langkah-2)
    await bookingPage.gotoStep2();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);
    await expect.soft(bookingPage.step2).toHaveAttribute('data-state', 'active');
    await expect.soft(bookingPage.step2CtaButton).toBeVisible();

    // Route 5: Booking Step 3 (/booking/langkah-3)
    await bookingPage.gotoStep3();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-3/);
    await expect.soft(bookingPage.step3).toHaveAttribute('data-state', 'active');
    await expect.soft(bookingPage.confirmBookingButton).toBeVisible();

    // Route 6: Booking Success Confirmation (/booking/konfirmasi)
    await bookingPage.gotoConfirmation();
    await expect.soft(page).toHaveURL(/\/booking\/konfirmasi/);
    await expect.soft(bookingPage.successCheckBadge).toBeVisible();
    await expect.soft(bookingPage.finishSuccessModalButton).toBeVisible();

    // Route 7: Reviews Feed (/ulasan)
    await reviewPage.gotoReviews();
    await expect.soft(page).toHaveURL(/\/ulasan/);
    await expect.soft(reviewPage.aggregateCard).toBeVisible();
    await expect.soft(reviewPage.writeReviewButton).toBeVisible();

    // Route 8: Write Review Modal Sheet (/ulasan/tulis)
    await reviewPage.gotoWriteReview();
    await expect.soft(page).toHaveURL(/\/ulasan\/tulis/);
    await expect.soft(reviewPage.modalTitle).toBeVisible();
    await expect.soft(reviewPage.submitReviewButton).toBeVisible();

    // Verify no unhandled JavaScript errors were thrown across all 8 routes
    expect.soft(pageErrors).toEqual([]);
  });

  test('unknown routes redirect to home / with replace (404 handling)', async ({ page }) => {
    // Attempt navigation to a non-existent route
    await page.goto('/halaman-tidak-ditemukan-404');
    await expect.soft(page).toHaveURL('/');
    await expect.soft(homePage.statusPill).toBeVisible();
    await expect.soft(homePage.doctorName).toHaveText('Corina Wulandari');

    // Attempt navigation to a nested non-existent route
    await page.goto('/booking/invalid/route/test');
    await expect.soft(page).toHaveURL('/');
    await expect.soft(homePage.statusPill).toBeVisible();
  });

  test('inter-route navigation flows work seamlessly between pages', async ({ page }) => {
    // 1. Home -> Profile
    await homePage.goto();
    await homePage.navigateToProfile();
    await expect.soft(page).toHaveURL(/\/profil/);

    // 2. Profile -> Reviews
    await homePage.profileRatingBadge.click();
    await expect.soft(page).toHaveURL(/\/ulasan/);

    // 3. Reviews -> Write Review
    await reviewPage.writeReviewButton.click();
    await expect.soft(page).toHaveURL(/\/ulasan\/tulis/);

    // 4. Close Write Review modal -> Reviews
    await reviewPage.closeModalButton.click();
    await expect.soft(page).toHaveURL(/\/ulasan/);

    // 5. Reviews -> Profile (via TopNavBar back button)
    await reviewPage.navBackButton.click();
    await expect.soft(page).toHaveURL(/\/profil/);

    // 6. Profile -> Home (via Profile back button)
    await homePage.profileBackButton.click();
    await expect.soft(page).toHaveURL('/');

    // 7. Home -> Booking Step 1
    await homePage.navigateToBooking();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);

    // 8. Booking Step 1 -> Booking Step 2
    await bookingPage.step1CtaButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);

    // 9. Booking Step 2 back button -> Booking Step 1
    await bookingPage.navBackButton.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-1/);

    // 10. Booking Step 1 back button -> Home
    await bookingPage.navBackButton.click();
    await expect.soft(page).toHaveURL('/');
  });

  test('mobile frame responds correctly to mobile vs desktop viewport dimensions', async ({ page }) => {
    await homePage.goto();
    const frame = homePage.mobileFrame;
    await expect.soft(frame).toBeVisible();

    const viewport = page.viewportSize();
    const frameBox = await frame.boundingBox();
    expect.soft(frameBox).not.toBeNull();

    if (viewport && frameBox) {
      if (viewport.width < 640) {
        // Mobile viewport (e.g. iPhone 14 - 390px wide): Frame spans full width of screen
        expect.soft(frameBox.width).toBeCloseTo(viewport.width, 1);
        expect.soft(frameBox.x).toBeCloseTo(0, 1);
      } else {
        // Desktop viewport (e.g. Desktop Chrome - 1280px wide):
        // Frame width is constrained to max 420px and centered horizontally
        expect.soft(frameBox.width).toBeLessThanOrEqual(420);
        const expectedLeftMargin = (viewport.width - frameBox.width) / 2;
        expect.soft(frameBox.x).toBeCloseTo(expectedLeftMargin, 5);
      }
    }
  });
});

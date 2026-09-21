import { test, expect } from '@playwright/test';

test.describe('Task 2: Core UI Primitives & Mobile Frame Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
  });

  test('MobileFrame renders container and home indicator without simulated status bar', async ({ page }) => {
    const frame = page.getByTestId('mobile-frame');
    await expect.soft(frame).toBeVisible();

    // Simulated status bar and dynamic island should NOT be present
    await expect.soft(page.getByTestId('status-bar')).not.toBeAttached();
    await expect.soft(page.getByTestId('dynamic-island')).not.toBeAttached();

    // Home indicator
    const homeIndicator = page.getByTestId('home-indicator');
    await expect.soft(homeIndicator).toBeVisible();
    const indicatorBox = await homeIndicator.boundingBox();
    expect.soft(indicatorBox?.width).toBeCloseTo(134, -1);
    expect.soft(indicatorBox?.height).toBeCloseTo(5, -1);
  });

  test('TopNavBar displays title, accessible back button, and right action', async ({ page }) => {
    const topNavBar = page.getByTestId('top-nav-bar');
    await expect.soft(topNavBar).toBeVisible();

    const title = page.getByTestId('nav-title');
    await expect.soft(title).toBeVisible();

    const backButton = page.getByTestId('nav-back-button');
    await expect.soft(backButton).toBeVisible();
    await expect.soft(backButton).toHaveAttribute('aria-label', /kembali|back/i);

    // Min 44x44px touch target check
    const backBox = await backButton.boundingBox();
    expect.soft(backBox?.height).toBeGreaterThanOrEqual(44);
    expect.soft(backBox?.width).toBeGreaterThanOrEqual(44);

    const rightAction = page.getByTestId('nav-right-action');
    await expect.soft(rightAction).toBeVisible();
  });

  test('Buttons render variants with tactile feedback class and min 44px height', async ({ page }) => {
    const limeBtn = page.getByTestId('btn-lime');
    await expect.soft(limeBtn).toBeVisible();
    await expect.soft(limeBtn).toHaveClass(/btn-tactile/);

    const forestBtn = page.getByTestId('btn-forest');
    await expect.soft(forestBtn).toBeVisible();
    await expect.soft(forestBtn).toHaveClass(/btn-tactile/);

    const outlineBtn = page.getByTestId('btn-outline');
    await expect.soft(outlineBtn).toBeVisible();

    const subtleBtn = page.getByTestId('btn-subtle');
    await expect.soft(subtleBtn).toBeVisible();

    // Check touch target heights >= 44px
    const limeBox = await limeBtn.boundingBox();
    expect.soft(limeBox?.height).toBeGreaterThanOrEqual(44);

    const forestBox = await forestBtn.boundingBox();
    expect.soft(forestBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('Card renders squircle container with data-testid support', async ({ page }) => {
    const card = page.getByTestId('test-card');
    await expect.soft(card).toBeVisible();
    await expect.soft(card).toHaveClass(/rounded-/);
  });

  test('Stepper renders 3 steps with completed, active, and upcoming states', async ({ page }) => {
    const stepper = page.getByTestId('stepper');
    await expect.soft(stepper).toBeVisible();

    const step1 = page.getByTestId('step-1');
    const step2 = page.getByTestId('step-2');
    const step3 = page.getByTestId('step-3');

    await expect.soft(step1).toBeVisible();
    await expect.soft(step2).toBeVisible();
    await expect.soft(step3).toBeVisible();

    // In demo currentStep is 2: step 1 is completed, step 2 is active, step 3 is upcoming
    await expect.soft(step1).toHaveAttribute('data-state', 'completed');
    await expect.soft(step2).toHaveAttribute('data-state', 'active');
    await expect.soft(step3).toHaveAttribute('data-state', 'upcoming');
  });

  test('IosSwitch renders accessible switch with 51x31px dimensions and toggles state', async ({ page }) => {
    const switchEl = page.getByRole('switch', { name: /notifikasi|pengingat|toggle|anonim/i });
    await expect.soft(switchEl).toBeVisible();

    // Check initial state
    const initialChecked = await switchEl.getAttribute('aria-checked');

    // Click to toggle
    await switchEl.click();
    const newChecked = await switchEl.getAttribute('aria-checked');
    expect.soft(newChecked).not.toBe(initialChecked);

    // Check switch pill dimensions (~51x31px)
    const switchBox = await switchEl.boundingBox();
    expect.soft(switchBox?.width).toBeCloseTo(51, -1);
    expect.soft(switchBox?.height).toBeCloseTo(31, -1);
  });

  test('StarRating supports interactive rating selection and displays stars', async ({ page }) => {
    const starRating = page.getByTestId('interactive-star-rating');
    await expect.soft(starRating).toBeVisible();

    const star4 = page.getByTestId('star-4');
    await expect.soft(star4).toBeVisible();

    // Check 44x44px touch target on interactive star button
    const starBox = await star4.boundingBox();
    expect.soft(starBox?.width).toBeGreaterThanOrEqual(44);
    expect.soft(starBox?.height).toBeGreaterThanOrEqual(44);

    // Click star 4
    await star4.click();
    await expect.soft(page.getByTestId('rating-value')).toHaveText(/4/);
  });
});

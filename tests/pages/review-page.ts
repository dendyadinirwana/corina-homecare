import { Page, Locator } from '@playwright/test';

export class ReviewPage {
  readonly page: Page;
  readonly mobileFrame: Locator;
  readonly navBar: Locator;
  readonly navTitle: Locator;
  readonly navBackButton: Locator;

  // Reviews list (/ulasan)
  readonly aggregateCard: Locator;
  readonly aggregateScore: Locator;
  readonly totalReviewsCount: Locator;
  readonly satisfactionBadge: Locator;
  readonly ratingBars: Locator;
  readonly aspectPunctuality: Locator;
  readonly aspectEmpathy: Locator;
  readonly aspectExplanation: Locator;
  readonly filterPillSemua: Locator;
  readonly filterPillKunjungan: Locator;
  readonly filterPillLansia: Locator;
  readonly filterPillLab: Locator;
  readonly sortSelect: Locator;
  readonly writeReviewButton: Locator;

  // Write review modal (/ulasan/tulis)
  readonly modalTitle: Locator;
  readonly closeModalButton: Locator;
  readonly helpLink: Locator;
  readonly visitSummaryCard: Locator;
  readonly mainStarRating: Locator;
  readonly feedbackBadge: Locator;
  readonly subRatingPunctuality: Locator;
  readonly subRatingHygiene: Locator;
  readonly subRatingFriendliness: Locator;
  readonly charCounter: Locator;
  readonly reviewTextarea: Locator;
  readonly anonymousCard: Locator;
  readonly anonymousSwitch: Locator;
  readonly submitReviewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileFrame = page.getByTestId('mobile-frame');
    this.navBar = page.getByTestId('top-nav-bar');
    this.navTitle = page.getByTestId('nav-title');
    this.navBackButton = page.getByTestId('nav-back-button');

    // Reviews list
    this.aggregateCard = page.getByTestId('aggregate-rating-card');
    this.aggregateScore = page.getByTestId('aggregate-score');
    this.totalReviewsCount = page.getByTestId('total-reviews-count');
    this.satisfactionBadge = page.getByTestId('satisfaction-badge');
    this.ratingBars = page.getByTestId('rating-bars');
    this.aspectPunctuality = page.getByTestId('aspect-punctuality');
    this.aspectEmpathy = page.getByTestId('aspect-empathy');
    this.aspectExplanation = page.getByTestId('aspect-explanation');
    this.filterPillSemua = page.getByTestId('filter-pill-semua');
    this.filterPillKunjungan = page.getByTestId('filter-pill-kunjungan-rumah');
    this.filterPillLansia = page.getByTestId('filter-pill-rawat-lansia');
    this.filterPillLab = page.getByTestId('filter-pill-cek-lab');
    this.sortSelect = page.getByTestId('select-sort-reviews');
    this.writeReviewButton = page.getByTestId('btn-write-review');

    // Write review modal
    this.modalTitle = page.getByTestId('modal-title');
    this.closeModalButton = page.getByTestId('btn-close-modal');
    this.helpLink = page.getByTestId('link-bantuan');
    this.visitSummaryCard = page.getByTestId('visit-summary-card');
    this.mainStarRating = page.getByTestId('main-star-rating');
    this.feedbackBadge = page.getByTestId('feedback-badge');
    this.subRatingPunctuality = page.getByTestId('sub-rating-punctuality');
    this.subRatingHygiene = page.getByTestId('sub-rating-hygiene');
    this.subRatingFriendliness = page.getByTestId('sub-rating-friendliness');
    this.charCounter = page.getByTestId('char-counter');
    this.reviewTextarea = page.getByTestId('textarea-review-comment');
    this.anonymousCard = page.getByTestId('card-anonymous-toggle');
    this.anonymousSwitch = page.getByTestId('switch-anonymous');
    this.submitReviewButton = page.getByTestId('btn-submit-review');
  }

  async gotoReviews() {
    await this.page.goto('/ulasan');
  }

  async gotoWriteReview() {
    await this.page.goto('/ulasan/tulis');
  }

  async filterBy(category: 'semua' | 'kunjungan' | 'lansia' | 'lab') {
    if (category === 'semua') await this.filterPillSemua.click();
    else if (category === 'kunjungan') await this.filterPillKunjungan.click();
    else if (category === 'lansia') await this.filterPillLansia.click();
    else if (category === 'lab') await this.filterPillLab.click();
  }

  async setRating(stars: number) {
    await this.page.getByTestId(`star-${stars}`).click();
  }

  async fillReview(comment: string, anonymous?: boolean) {
    await this.reviewTextarea.fill(comment);
    if (anonymous !== undefined) {
      const isChecked = (await this.anonymousSwitch.getAttribute('aria-checked')) === 'true';
      if (isChecked !== anonymous) {
        await this.anonymousSwitch.click();
      }
    }
  }

  async submit() {
    await this.submitReviewButton.click();
  }
}

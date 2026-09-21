import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly mobileFrame: Locator;
  readonly statusPill: Locator;
  readonly doctorAvatar: Locator;
  readonly doctorName: Locator;
  readonly doctorSpecialty: Locator;
  readonly doctorRegistration: Locator;
  readonly badgeFk: Locator;
  readonly badgeExperience: Locator;
  readonly badgeRating: Locator;
  readonly whatsappCard: Locator;
  readonly whatsappLink: Locator;
  readonly orderButton: Locator;
  readonly serviceCardHomecare: Locator;
  readonly serviceCardElderly: Locator;
  readonly serviceCardLab: Locator;
  readonly serviceCardWound: Locator;
  readonly domisiliFootnote: Locator;

  // Profile elements (/profil)
  readonly profileHeroImage: Locator;
  readonly profileBackButton: Locator;
  readonly profileFavoriteButton: Locator;
  readonly profileMoreButton: Locator;
  readonly profileRatingBadge: Locator;
  readonly profileReviewLink: Locator;
  readonly profileAiSummary: Locator;
  readonly profileScheduleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileFrame = page.getByTestId('mobile-frame');
    this.statusPill = page.getByTestId('status-pill');
    this.doctorAvatar = page.getByTestId('doctor-avatar');
    this.doctorName = page.getByTestId('doctor-name');
    this.doctorSpecialty = page.getByTestId('doctor-specialty');
    this.doctorRegistration = page.getByTestId('doctor-registration');
    this.badgeFk = page.getByTestId('badge-fk');
    this.badgeExperience = page.getByTestId('badge-experience');
    this.badgeRating = page.getByTestId('badge-rating');
    this.whatsappCard = page.getByTestId('whatsapp-emergency-card');
    this.whatsappLink = page.getByTestId('whatsapp-link');
    this.orderButton = page.getByTestId('btn-pesan-kunjungan');
    this.serviceCardHomecare = page.getByTestId('service-card-kunjungan-rumah');
    this.serviceCardElderly = page.getByTestId('service-card-lansia');
    this.serviceCardLab = page.getByTestId('service-card-lab');
    this.serviceCardWound = page.getByTestId('service-card-perawatan-luka');
    this.domisiliFootnote = page.getByTestId('domisili-footnote');

    this.profileHeroImage = page.getByTestId('profile-hero-image');
    this.profileBackButton = page.getByTestId('btn-back');
    this.profileFavoriteButton = page.getByTestId('btn-favorite');
    this.profileMoreButton = page.getByTestId('btn-more');
    this.profileRatingBadge = page.getByTestId('profile-rating-badge');
    this.profileReviewLink = page.getByTestId('link-tulis-ulasan');
    this.profileAiSummary = page.getByTestId('ai-summary-box');
    this.profileScheduleButton = page.getByTestId('btn-jadwalkan-kunjungan');
  }

  async goto() {
    await this.page.goto('/');
  }

  async gotoProfile() {
    await this.page.goto('/profil');
  }

  async navigateToBooking() {
    await this.orderButton.click();
  }

  async navigateToProfile() {
    await this.badgeFk.click();
  }
}

import { Page, Locator } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly mobileFrame: Locator;
  readonly navBar: Locator;
  readonly navTitle: Locator;
  readonly navBackButton: Locator;
  readonly stepper: Locator;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly step3: Locator;

  // Step 1 locators
  readonly miniDoctorCard: Locator;
  readonly calendarSection: Locator;
  readonly calendarMonthLabel: Locator;
  readonly prevMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly serviceTypeHomecare: Locator;
  readonly serviceTypeTeleconsultation: Locator;
  readonly step1CtaButton: Locator;

  // Step 2 locators
  readonly selectedDateBanner: Locator;
  readonly selectedDateChangeButton: Locator;
  readonly equipmentNoticeBanner: Locator;
  readonly step2CtaButton: Locator;

  // Step 3 locators
  readonly inputPatientName: Locator;
  readonly inputPatientPhone: Locator;
  readonly inputPatientAddress: Locator;
  readonly inputPatientLandmark: Locator;
  readonly selectComplaint: Locator;
  readonly textareaComplaint: Locator;
  readonly mapPickerContainer: Locator;
  readonly mapCoordinatesPill: Locator;
  readonly useCurrentLocationButton: Locator;
  readonly bookingLiveSummary: Locator;
  readonly confirmBookingButton: Locator;

  // Confirmation locators
  readonly successCheckBadge: Locator;
  readonly successTitle: Locator;
  readonly successSubtitle: Locator;
  readonly successDoctorCard: Locator;
  readonly reservationDetailsCard: Locator;
  readonly emailConfirmationNotice: Locator;
  readonly downloadCalendarButton: Locator;
  readonly closeSuccessModalButton: Locator;
  readonly finishSuccessModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileFrame = page.getByTestId('mobile-frame');
    this.navBar = page.getByTestId('top-nav-bar');
    this.navTitle = page.getByTestId('nav-title');
    this.navBackButton = page.getByTestId('nav-back-button');
    this.stepper = page.getByTestId('stepper');
    this.step1 = page.getByTestId('step-1');
    this.step2 = page.getByTestId('step-2');
    this.step3 = page.getByTestId('step-3');

    // Step 1
    this.miniDoctorCard = page.getByTestId('mini-doctor-card');
    this.calendarSection = page.getByTestId('calendar-picker-section');
    this.calendarMonthLabel = page.getByTestId('calendar-month-label');
    this.prevMonthButton = page.getByTestId('btn-prev-month');
    this.nextMonthButton = page.getByTestId('btn-next-month');
    this.serviceTypeHomecare = page.getByTestId('service-type-homecare');
    this.serviceTypeTeleconsultation = page.getByTestId('service-type-teleconsultation');
    this.step1CtaButton = page.getByTestId('btn-next-step-1');

    // Step 2
    this.selectedDateBanner = page.getByTestId('selected-date-banner');
    this.selectedDateChangeButton = page.getByTestId('btn-change-date');
    this.equipmentNoticeBanner = page.getByTestId('sterile-equipment-notice');
    this.step2CtaButton = page.getByTestId('btn-next-step-2');

    // Step 3
    this.inputPatientName = page.getByTestId('input-patient-name');
    this.inputPatientPhone = page.getByTestId('input-patient-phone');
    this.inputPatientAddress = page.getByTestId('input-patient-address');
    this.inputPatientLandmark = page.getByTestId('input-patient-landmark');
    this.selectComplaint = page.getByTestId('select-complaint');
    this.textareaComplaint = page.getByTestId('textarea-complaint');
    this.mapPickerContainer = page.getByTestId('map-picker-container');
    this.mapCoordinatesPill = page.getByTestId('map-coordinates-pill');
    this.useCurrentLocationButton = page.getByTestId('btn-use-current-location');
    this.bookingLiveSummary = page.getByTestId('booking-live-summary');
    this.confirmBookingButton = page.getByTestId('btn-confirm-booking');

    // Confirmation
    this.successCheckBadge = page.getByTestId('badge-success-check');
    this.successTitle = page.getByTestId('booking-success-title');
    this.successSubtitle = page.getByTestId('booking-success-subtitle');
    this.successDoctorCard = page.getByTestId('success-doctor-card');
    this.reservationDetailsCard = page.getByTestId('reservation-details-card');
    this.emailConfirmationNotice = page.getByTestId('email-confirmation-notice');
    this.downloadCalendarButton = page.getByTestId('btn-download-calendar');
    this.closeSuccessModalButton = page.getByTestId('btn-close-modal');
    this.finishSuccessModalButton = page.getByTestId('btn-finish-modal');
  }

  async gotoStep1() {
    await this.page.goto('/booking/langkah-1');
  }

  async gotoStep2() {
    await this.page.goto('/booking/langkah-2');
  }

  async gotoStep3() {
    await this.page.goto('/booking/langkah-3');
  }

  async gotoConfirmation() {
    await this.page.goto('/booking/konfirmasi');
  }

  async selectServiceType(type: 'homecare' | 'teleconsultation') {
    if (type === 'homecare') {
      await this.serviceTypeHomecare.click();
    } else {
      await this.serviceTypeTeleconsultation.click();
    }
  }

  async fillPatientDetails(details: {
    name?: string;
    phone?: string;
    address?: string;
    landmark?: string;
    complaint?: string;
    notes?: string;
  }) {
    if (details.name) await this.inputPatientName.fill(details.name);
    if (details.phone) await this.inputPatientPhone.fill(details.phone);
    if (details.address) await this.inputPatientAddress.fill(details.address);
    if (details.landmark) await this.inputPatientLandmark.fill(details.landmark);
    if (details.complaint) await this.selectComplaint.selectOption(details.complaint);
    if (details.notes) await this.textareaComplaint.fill(details.notes);
  }
}

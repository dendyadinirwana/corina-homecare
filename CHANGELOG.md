# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-09-21

### Added
- **Native App Shell Layout (Fixed Navbar & Fixed Bottom CTA)**:
  - Added dedicated `footer` slot to `MobileFrame.tsx` with frosted glass backdrop blur (`bg-surface/95 backdrop-blur-md`) and safe-area inset padding.
  - Pinned Top Navigation Bar (`TopNavBar`) and Bottom CTA permanently in place like a native mobile app (Halodoc/iOS Health), completely immune to page scroll.
  - Isolated scrollable middle viewport (`<main>`) with iOS/Android inertia scroll (`scroll-touch`, `overscroll-behavior-y: contain`).
- **Cloudflare Pages Deployment Configuration**:
  - Configured SPA fallback generation (`200.html` & `404.html`) in the production build pipeline.
  - Connected Cloudflare Pages with D1 database binding (`homecare-db`) on custom domain `corinawulandari.my.id` and `corina-homecare.pages.dev`.

### Changed
- Refactored `BookingStep1Page`, `BookingStep2Page`, `BookingStep3Page`, and `ProfilePage` to utilize the fixed `footer` slot on `MobileFrame`.

---

## [1.2.0] - 2026-09-21

### Added
- **GSAP Animated Bottom Sheet**: Rebuilt the slot collision dialog (`BookingStep3Page.tsx`) into an authentic mobile bottom sheet featuring a tactile drag-indicator pill, smooth slide-up entrance (`yPercent: 100 -> 0`), and blurred backdrop overlay.
- **GSAP Motion Helpers**: Added `animateBottomSheetEntrance` and `animateBottomSheetExit` utility helpers in `src/lib/motion.ts`.
- **Android System Chrome Integration**: Added `<meta name="theme-color" content="#FFFFFF" />` and `<meta name="apple-mobile-web-app-status-bar-style" content="default" />` in `index.html`.

### Changed
- **Mobile Container Architecture**:
  - Replaced rigid `h-[100dvh]` inner container scroll trapping with native document/window scroll on mobile browsers.
  - Enabled Android Chrome URL bar and toolbar auto-collapse on scroll.
  - Fixed sticky navigation headers (`TopNavBar`) and sticky bottom CTAs with safe area inset preservation.
  - Automatic `window.scrollTo(0, 0)` reset on inter-route navigation for consistent mobile screen positioning.
- **Visual Contrast & Hierarchy**:
  - Grouped page background set to `#F2F2F7` (Apple iOS grouped canvas / light clinical grey).
  - Cards updated to crisp `#FFFFFF` with hairline borders (`#E5E7EB`) and subtle shadow, providing sharp visual separation in bright mobile environments.

---

## [1.1.0] - 2026-09-21

### Added
- **Interactive Geolocation & Map Picker**: Integrated Leaflet OpenStreetMap with custom coordinates pinning, live accuracy radar pulse (`animate-radar`), and GPS coordinate readout.
- **Smart Cloudflare D1 Booking API & Edge Functions**:
  - `/api/bookings` endpoint with SQL transactional atomic slot conflict guard (HTTP 409 Conflict detection).
  - `/api/bookings/availability` endpoint fetching real-time reserved slots for any given date.
  - Seamless frontend client fallback to `localStorage` mock store for offline/static deployment environments.
- **Atomic Slot Collision Handling**: In-app conflict modal on Booking Step 3 redirecting users back to Step 2 with the occupied slot dynamically disabled.
- **Micro-Interactions & Transitions**:
  - Tactile button press feedback (`.btn-tactile`) using mechanical spring compression (`scale(0.96)`).
  - Pop-in bounce entrance animation for booking confirmation badge.
  - Interactive star rating supporting both preview hover and click selection with accessible radiogroup roles.
  - Apple HIG compliant 51×31px binary toggle switch (`IosSwitch.tsx`).
- **Standardized Design Documentation**:
  - Added official `DESIGN.md` capturing tokens, color strategies, typography hierarchy, elevation, and anti-slop rules.
  - Created `.impeccable/design.json` machine-readable sidecar with 8-step tonal ramps and shadow DOM component definitions.
- **End-to-End Test Suite**: Comprehensive Playwright test suite covering 128 tests across 8 screens and edge cases.

### Changed
- **Visual De-Cluttering & Anti-Slop Refinement**:
  - Removed simulated device chrome (artificial iOS status bar, fake battery/signal icons, and dynamic island) to let native browsers handle device framing.
  - Removed simulated iOS home indicator bar for cleaner layout.
  - Removed redundant helper badges (`Mempercepat Dokter Tiba`, `Konfirmasi Instan`) in favor of clear, uncluttered form labels.
  - Cleaned up the `Gunakan Lokasi Saat Ini` geolocation button by removing redundant navigation icons and non-standard unicode glyphs.
  - Modified destination address display in Booking Step 3 summary to wrap naturally without truncation (`text-right break-words`).
- **Doctor Contact Information**: Updated direct WhatsApp and telephone channels to verified contact number (`+62 877-7207-7213`).
- **Responsive Architecture**: Centered 393px–420px mobile enclosure on desktop viewports, with seamless edge-to-edge 100vw layout on mobile devices.

### Fixed
- Fixed time slot collisions on Booking Step 2 by disabling already reserved slots.
- Fixed contact pill links and phone formatting across HomePage and ProfilePage.
- Fixed responsive padding and touch targets ensuring strict compliance with the minimum 44×44px Apple HIG standard.

---

## [1.0.0] - 2026-09-21

### Added
- Initial release of **Corina Wulandari - Personal Health & Homecare** mobile web application.
- 8 Core screens:
  1. `HomePage` (`/`): Bio-link hub, doctor credentials, emergency WhatsApp card, and 4 homecare service offerings.
  2. `ProfilePage` (`/profil`): Clinical biography, ratings, review summaries, case distribution donut chart, and quick consultation fee bar.
  3. `BookingStep1Page` (`/booking/langkah-1`): Interactive 7-day horizontal calendar with date picker and service type radio selection.
  4. `BookingStep2Page` (`/booking/langkah-2`): Morning, afternoon, and evening/night time slot selection grid with sterile equipment notice.
  5. `BookingStep3Page` (`/booking/langkah-3`): Patient contact form, Leaflet map coordinates picker, landmark notes, medical complaint categories, and live reservation summary.
  6. `BookingSuccessPage` (`/booking/konfirmasi`): Appointment confirmation modal, detailed receipt, and iCalendar (.ics) calendar file generation for Google/Apple Calendar.
  7. `ReviewsPage` (`/ulasan`): Patient testimonials, 4.9 aggregate rating breakdown, category filter pills, and helpful counter votes.
  8. `WriteReviewPage` (`/ulasan/tulis`): Patient review submission form with 5-star interactive rating, multi-aspect evaluation, and anonymous toggle.
- Zustand stores (`useBookingStore`, `useReviewStore`) with automatic `localStorage` persistence.
- Tailwind CSS styling with semantic color tokens: Signature Lime (`#D4F636`), Deep Clinical Forest Green (`#1E3322`), and iOS System Canvas (`#F2F2F7`).

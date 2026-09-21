# Personal Doctor Homecare Mobile Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web mobile-first *production-ready* untuk praktik mandiri dokter "Corina Wulandari - Personal Health & Homecare" dari nol mencakup 8 layar, booking wizard dengan geolokasi peta Leaflet, sistem ulasan, dan motion tokens Apple HIG.

**Architecture:** Single Page Application berbasis React + Vite + TypeScript dengan routing `react-router-dom`, centered mobile frame iPhone (393px–420px), Zustand state dengan persistensi `localStorage`, serta peta interaktif Leaflet OpenStreetMap.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Zustand, Leaflet, Playwright (TypeScript).

**Spec:** `docs/superpowers/specs/2026-09-21-personal-homecare-design.md`

## Global Constraints

- Apple iOS HIG Aesthetic: Minimalis, clean, typography Inter/system-ui, concentric rounded corners, min touch target 44x44px.
- Transitions-dev: Motion tokens (`--duration-*`, `--ease-*`), tactile active scale `0.96` (`.btn-tactile`).
- Testing: Playwright with TypeScript, Page Object Model, `getByRole` & `getByTestId`, no CSS selector reliance, soft assertions.
- Mobile viewport: Centered max 420px frame on desktop, 100vw on mobile devices.

---

### Task 1: Project Initialization, Dependencies, Tailwind CSS, & Assets

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/styles/globals.css`
- Create: `playwright.config.ts`
- Asset Copy: `public/doctor-profile.jpg`

**Interfaces:**
- Produces: Base project structure, CSS variables token scale, Tailwind classes, Playwright config.

- [ ] **Step 1: Write `package.json` with dependencies**
```json
{
  "name": "corina-homecare",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.29.0",
    "tailwind-merge": "^3.0.1",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.1",
    "@types/leaflet": "^1.9.16",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
```

- [ ] **Step 2: Write configs (`vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `index.html`)**
- [ ] **Step 3: Write `src/styles/globals.css` with tokens from spec**
- [ ] **Step 4: Copy `doctor-profile.jpg` from `/Users/dendyadinirwana/Documents/homecare-assets/doctor-profile.jpg` to `public/`**
- [ ] **Step 5: Run `npm install` and verify build works (`npm run build`)**
- [ ] **Step 6: Commit**
```bash
git add package.json vite.config.ts tsconfig*.json tailwind.config.js postcss.config.js index.html src/styles/ globals.css public/
git commit -m "chore: initialize vite project with tailwind, tokens, and assets"
```

---

### Task 2: Core UI Primitives & Mobile Frame Layout Container

**Files:**
- Create: `src/components/layout/MobileFrame.tsx`
- Create: `src/components/layout/StatusBar.tsx`
- Create: `src/components/layout/TopNavBar.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Stepper.tsx`
- Create: `src/components/ui/IosSwitch.tsx`
- Create: `src/components/ui/StarRating.tsx`
- Test: `tests/pages/layout.spec.ts`

**Interfaces:**
- Produces:
  - `MobileFrame({ children, hideNav, title, showBack }: MobileFrameProps)`
  - `Button({ variant, size, onClick, children, ...props }: ButtonProps)`
  - `Card({ children, className, onClick }: CardProps)`
  - `Stepper({ currentStep, steps }: StepperProps)`
  - `IosSwitch({ checked, onChange, label }: IosSwitchProps)`
  - `StarRating({ rating, onChange, interactive, size }: StarRatingProps)`

- [ ] **Step 1: Write failing layout spec test `tests/pages/layout.spec.ts` checking for frame rendering and status bar**
- [ ] **Step 2: Implement `StatusBar.tsx`, `MobileFrame.tsx`, and `TopNavBar.tsx`**
- [ ] **Step 3: Implement `Button.tsx` with `.btn-tactile` and variants (lime, primary, outline, subtle)**
- [ ] **Step 4: Implement `Card.tsx`, `Stepper.tsx`, `IosSwitch.tsx`, and `StarRating.tsx`**
- [ ] **Step 5: Run Playwright test to verify layout elements render correctly**
- [ ] **Step 6: Commit**
```bash
git add src/components/ tests/
git commit -m "feat: add mobile frame layout and core apple HIG ui primitives"
```

---

### Task 3: State Management & Types (Booking & Review Stores)

**Files:**
- Create: `src/types/index.ts`
- Create: `src/store/bookingStore.ts`
- Create: `src/store/reviewStore.ts`
- Create: `src/utils/calendar.ts`
- Test: `tests/store.spec.ts`

**Interfaces:**
- Consumes: Zustand persist middleware, LocalStorage.
- Produces:
  - `useBookingStore`: `draft`, `confirmedBooking`, `setDraft(data)`, `confirmBooking()`, `resetDraft()`
  - `useReviewStore`: `reviews`, `addReview(review)`, `likeReview(id)`
  - `generateIcsFile(booking: Booking): void`

- [ ] **Step 1: Write failing unit/integration test `tests/store.spec.ts` validating store persistence and calendar generator**
- [ ] **Step 2: Define all interfaces in `src/types/index.ts`**
- [ ] **Step 3: Implement `src/store/bookingStore.ts` with default draft dates and state setters**
- [ ] **Step 4: Implement `src/store/reviewStore.ts` seeded with 3 realistic reviews from `homecare.pen`**
- [ ] **Step 5: Implement `src/utils/calendar.ts` (.ics download trigger)**
- [ ] **Step 6: Run tests to verify store operations pass**
- [ ] **Step 7: Commit**
```bash
git add src/types/ src/store/ src/utils/ tests/
git commit -m "feat: implement booking and review stores with localstorage persistence"
```

---

### Task 4: Layar 1 (Beranda & Bio-Link Hub) & Layar 2 (Profil & Detail Klinis Dokter)

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ProfilePage.tsx`
- Test: `tests/home-and-profile.spec.ts`

**Interfaces:**
- Consumes: `MobileFrame`, `Card`, `Button`, `doctor-profile.jpg`
- Produces: Routes `/` (Home) and `/profil` (Profile)

- [ ] **Step 1: Write failing test in `tests/home-and-profile.spec.ts` checking elements of Layar 1 and Layar 2**
- [ ] **Step 2: Implement `src/pages/HomePage.tsx`**
  - Doctor avatar, SIP No, experience pills, live status dot
  - WhatsApp emergency card with active pulse
  - 4 Homecare service action cards (with Lime "Pesan" button linking to `/booking/langkah-1`)
  - Footnote domisili Tangerang Selatan
- [ ] **Step 3: Implement `src/pages/ProfilePage.tsx`**
  - Full-width portrait hero with Back and Favorite buttons
  - Quick contact pills (phone, email, domisili)
  - AI Review summary box
  - 3 metric cards (4.63★, 4.19★, 4.74★)
  - Donut chart for visit reasons (Hipertensi 35%, Kardiologi 25%, etc.)
  - Sticky footer with Rp 250.000 fee and "Jadwalkan Kunjungan" CTA button
- [ ] **Step 4: Verify navigation between `/` and `/profil` works**
- [ ] **Step 5: Commit**
```bash
git add src/pages/ tests/
git commit -m "feat: implement screen 1 home portal and screen 2 doctor profile"
```

---

### Task 5: Layar 3 & 4 (Booking Step 1: Tanggal & Jenis Kunjungan, Step 2: Jam Kunjungan)

**Files:**
- Create: `src/pages/BookingStep1Page.tsx`
- Create: `src/pages/BookingStep2Page.tsx`
- Test: `tests/booking-steps-1-2.spec.ts`

**Interfaces:**
- Consumes: `useBookingStore`, `Stepper`, `MobileFrame`, `Button`, `Card`
- Produces: Routes `/booking/langkah-1` and `/booking/langkah-2`

- [ ] **Step 1: Write failing test in `tests/booking-steps-1-2.spec.ts` for step 1 & 2 selections**
- [ ] **Step 2: Implement `src/pages/BookingStep1Page.tsx`**
  - Stepper 3 tahap (Step 1 active)
  - Mini doctor card
  - 7-day horizontal calendar selector with active day indicator
  - Visit type radio selection (Kunjungan Rumah vs Telekonsultasi)
  - CTA button "Lanjut Pilih Jam Kunjungan →" saving selection to store
- [ ] **Step 3: Implement `src/pages/BookingStep2Page.tsx`**
  - Stepper (Step 2 active)
  - Selected date summary banner with "Ubah" link
  - Time slots grid (Pagi: 09-12, Siang: 13-16, Sore & Malam: 17-20)
  - Medical steril equipment notice banner
  - CTA button "Lanjut ke Data Pasien →" saving time slot to store
- [ ] **Step 4: Run tests and verify transitions**
- [ ] **Step 5: Commit**
```bash
git add src/pages/ tests/
git commit -m "feat: implement booking wizard steps 1 and 2"
```

---

### Task 6: Layar 5 & 6 (Booking Step 3 with Leaflet Map & Step 4 Confirmation)

**Files:**
- Create: `src/components/map/MapPicker.tsx`
- Create: `src/pages/BookingStep3Page.tsx`
- Create: `src/pages/BookingSuccessPage.tsx`
- Test: `tests/booking-flow.spec.ts`

**Interfaces:**
- Consumes: `useBookingStore`, `generateIcsFile`, Leaflet API
- Produces: Routes `/booking/langkah-3` and `/booking/konfirmasi`

- [ ] **Step 1: Write failing E2E test `tests/booking-flow.spec.ts` covering form submission and confirmation**
- [ ] **Step 2: Implement `src/components/map/MapPicker.tsx`**
  - Leaflet map rendering with custom pin and radar pulse circle
  - Geolocation button triggering `navigator.geolocation.getCurrentPosition`
  - Fallback coordinates `-6.2841, 106.7265` (Tangsel)
  - Pin drag / map click updates coordinates and emits changes
- [ ] **Step 3: Implement `src/pages/BookingStep3Page.tsx`**
  - Patient Name and WhatsApp input fields
  - Address text field and MapPicker coordinate integration
  - Landmark / patokan field
  - Medical complaint category & history
  - Live summary card
  - CTA button "Konfirmasi Janji Temu →" saving to `confirmedBooking`
- [ ] **Step 4: Implement `src/pages/BookingSuccessPage.tsx`**
  - Pop-in bouncing checkmark badge in Lime `#D4F636`
  - Reservation details card (Date, Time, Location, Doctor)
  - Email & WhatsApp notification reminder notice
  - "Tambah ke Kalender" button generating `.ics` file
  - "Lihat Rincian Reservasi" and "Kembali ke Beranda" buttons
- [ ] **Step 5: Run Playwright booking flow test to verify end-to-end booking works**
- [ ] **Step 6: Commit**
```bash
git add src/components/map/ src/pages/ tests/
git commit -m "feat: implement booking step 3 with leaflet map and confirmation screen"
```

---

### Task 7: Layar 7 & 8 (Daftar Ulasan Pasien & Formulir Tulis Ulasan)

**Files:**
- Create: `src/pages/ReviewsPage.tsx`
- Create: `src/pages/WriteReviewPage.tsx`
- Test: `tests/review-flow.spec.ts`

**Interfaces:**
- Consumes: `useReviewStore`, `StarRating`, `IosSwitch`, `MobileFrame`, `Button`
- Produces: Routes `/ulasan` and `/ulasan/tulis`

- [ ] **Step 1: Write failing test in `tests/review-flow.spec.ts` for adding and displaying reviews**
- [ ] **Step 2: Implement `src/pages/ReviewsPage.tsx`**
  - Overall aggregate score 4.9★, 128 ulasan, 99% puas, and rating distribution bars
  - 3 aspect ratings (Ketepatan Waktu, Sikap, Penjelasan)
  - Filter category pills (Semua, Kunjungan Rumah, Rawat Lansia, Cek Lab)
  - Review feed cards with initials, verified badge, date, review text, and helpful count
  - Sticky bottom action button "Tulis Ulasan" linking to `/ulasan/tulis`
- [ ] **Step 3: Implement `src/pages/WriteReviewPage.tsx`**
  - Modal sheet header with Close (X) button and Bantuan link
  - Completed visit summary card
  - 5 interactive big stars with live dynamic feedback text
  - 3 sub-ratings (Ketepatan Waktu, Higienitas, Keramahan)
  - Textarea with live character counter (limit 500)
  - iOS switch toggle "Tampilkan sebagai Pasien Anonim"
  - CTA button "Kirim Ulasan Sekarang" saving to store and redirecting to `/ulasan`
- [ ] **Step 4: Run review flow test to verify review submission and appearance in the list**
- [ ] **Step 5: Commit**
```bash
git add src/pages/ tests/
git commit -m "feat: implement patient reviews feed and write review modal"
```

---

### Task 8: Full Navigation Orchestration, Visual Polish, & Complete Verification

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Create: `tests/navigation.spec.ts`
- Create: `tests/pages/` (Page Object Models: `home-page.ts`, `booking-page.ts`, `review-page.ts`)

**Interfaces:**
- Consumes: All 8 screens, `react-router-dom`
- Produces: Complete production application with full test coverage and visual verification.

- [ ] **Step 1: Wire up all 8 routes in `src/App.tsx`**
- [ ] **Step 2: Implement Page Object Models in `tests/pages/` conforming to global agent rules**
- [ ] **Step 3: Run entire Playwright test suite (`npx playwright test`)**
- [ ] **Step 4: Perform visual inspection using Playwright MCP browser tool**
- [ ] **Step 5: Commit**
```bash
git add src/ tests/
git commit -m "feat: complete app orchestration, page objects, and full e2e verification"
```

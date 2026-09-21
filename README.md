# 🩺 Corina Wulandari — Personal Health & Homecare

> **Production-grade, mobile-first web application for independent doctor homecare services.**  
> Crafted with Apple iOS Human Interface Guidelines (HIG) aesthetics, tactile micro-interactions (`transitions-dev`), Leaflet GPS map integration, Cloudflare D1 slot collision guard, and zero-AI-slop design discipline.

[![Version](https://img.shields.io/badge/version-1.1.0-brightgreen.svg)](https://github.com/dendyadinirwana/corina-homecare/releases)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-128%20Passed-45ba4b.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📱 Live Demo & Overview

- **Production URL**: [https://corina-homecare.vercel.app](https://corina-homecare.vercel.app)
- **Target Experience**: Mobile-first touch interface (seamless 100vw on mobile devices, centered 393px–420px framed preview on desktop viewports).

This application was engineered specifically for independent homecare doctors and their patients. When medical needs arise at home, patients and family members need instant reassurance, rapid booking, precise address/GPS geolocation pinning, and direct clinical communication without cognitive friction or generic marketing fluff.

---

## ✨ Key Features

### 1. 8 Comprehensive Screens
1. **🏠 Beranda & Bio-Link Hub (`/`)**
   - Doctor identity profile with verified clinical credentials (`FK UI / Sp.PD`, `10+ Thn Pengalaman`, `4.9 ★`).
   - Direct 24-hour Emergency WhatsApp Card (`+62 877-7207-7213`).
   - 4 Signature homecare services (General Home Visit, Elderly & Chronic Care, Blood & Lab Sampling, Wound Care).
2. **👤 Profil & Detail Klinis Dokter (`/profil`)**
   - Doctor portrait, instant contact pills (Phone, Email, Practice Area).
   - Patient satisfaction breakdown and clinical metric ratings (Punctuality `4.63★`, Empathy `4.19★`, Explanation `4.74★`).
   - Donut chart case distribution (Hypertension 35%, Preventive Cardiology 25%, Heart Failure Monitoring 22%, Chest Pain 18%).
   - Sticky consultation booking fee bar (`Rp 250.000`).
3. **📅 Booking Langkah 1: Tanggal & Layanan (`/booking/langkah-1`)**
   - Interactive 7-day horizontal calendar picker with month navigation.
   - Radio selector for service type (Home Visit vs. Video Teleconsultation).
4. **⏰ Booking Langkah 2: Jam Kunjungan (`/booking/langkah-2`)**
   - Filtered time slot grid across Pagi (`09:00 - 12:00`), Siang (`13:00 - 16:00`), and Sore/Malam (`17:00 - 20:00`).
   - **Real-Time Slot Availability**: Automatically detects and disables occupied slots via Cloudflare D1 database.
   - Sterile medical equipment notice banner.
5. **📍 Booking Langkah 3: Data Pasien & Map GPS (`/booking/langkah-3`)**
   - Patient name & WhatsApp phone input.
   - **Interactive Leaflet Map Picker**: OpenStreetMap canvas with custom pin, live accuracy radar pulse animation (`animate-radar`), and GPS coordinates readout pill.
   - Geolocation button (`Gunakan Lokasi Saat Ini`) connecting to browser `navigator.geolocation`.
   - Full un-truncated address input and house landmark guide.
   - Medical complaint categorization dropdown and notes.
   - Live booking summary card and sticky CTA.
   - **Atomic Slot Conflict Guard**: In-app modal that catches 409 slot collisions if another patient books the same slot concurrently, redirecting smoothly back to Step 2.
6. **✅ Janji Temu Dikonfirmasi (`/booking/konfirmasi`)**
   - Pop-in spring checkmark entrance badge.
   - Detailed reservation receipt (Doctor, Service, Date, Time, GPS address, Contact).
   - **Add to Calendar**: Zero-dependency iCalendar (`.ics`) download for Google Calendar, Apple Calendar, and Outlook.
7. **⭐ Daftar Ulasan Pasien (`/ulasan`)**
   - 4.9 aggregate rating breakdown with category progress bars.
   - Filter pills (`Semua`, `Kunjungan Rumah`, `Rawat Lansia`, `Cek Lab`).
   - Patient review list with verified badges, helpful thumbs-up counters, and state persistence.
8. **✍️ Formulir Tulis Ulasan (`/ulasan/tulis`)**
   - Interactive 5-star rating with live dynamic sentiment badge.
   - Aspect ratings (Punctuality, Hygiene, Friendliness).
   - Experience notes textarea with live character counter (`214/500`).
   - Apple HIG 51×31px iOS Switch for anonymous reviews (*Tampilkan sebagai Pasien Anonim*).

---

## 🎨 Design System & Anti-Slop Discipline

Detailed design tokens, typography scales, elevation models, and component guidelines are documented in **[`DESIGN.md`](./DESIGN.md)** and **[`.impeccable/design.json`](./.impeccable/design.json)**.

### Color Anchors
| Token | Hex / Value | Semantic Role |
|---|---|---|
| `--accent-lime` | `#D4F636` | **Signature Lime**: Primary CTA forward-momentum conversion. |
| `--accent-forest` | `#1E3322` | **Deep Forest Green**: Clinical authority, headers, brand anchor. |
| `--accent-forest-light` | `#E8F8EE` | Status pill background and active stepper ring glow. |
| `--bg-canvas` | `#F2F2F7` | iOS System Grouped Background canvas. |
| `--bg-surface` | `#FFFFFF` | Primary white card and modal surface. |
| `--bg-card` | `#F8F8FA` | Tonal secondary background for inputs and nested cards. |
| `--accent-green-dot` | `#34C759` | Live active availability dot and active switch track. |
| `--whatsapp-green` | `#25D366` | Direct emergency WhatsApp badge. |

### Anti-Slop Rules (from Hallmark, Impeccable & Anti-Slop UI)
- ❌ **No fake device chrome**: No drawn fake battery icons, Wi-Fi bars, simulated iOS status bars, or home indicator lines on screen. Real devices supply their own native chrome.
- ❌ **No generic blue-purple gradients**: Solid, high-contrast, trustworthy clinical palette.
- ❌ **No ghost cards**: No 1px dark borders paired with giant blurry drop shadows.
- ❌ **No address truncation**: Patient addresses wrap naturally so critical delivery details are never hidden behind `...`.
- ❌ **No pill-shaped everything**: Buttons are pill-shaped (`rounded-full`), cards use `rounded-2xl` (24px), inputs use `rounded-xl` (12px).
- ✅ **Strict 44×44px Touch Targets**: Every button, input, pill, and link guarantees at least 44×44px interactive tap area.
- ✅ **Tactile Micro-Feedback (`transitions-dev`)**: Mechanical compression on press (`active:scale-96`) with cubic-bezier deceleration curves.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite 6
- **Routing**: React Router DOM v6 (with SPA fallback rewrites)
- **Styling**: Tailwind CSS v3, CSS Variables, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react` (uniform 2px stroke)
- **State Management**: `zustand` with `persist` middleware (`localStorage`)
- **Maps & Geolocation**: `leaflet`, OpenStreetMap tile layer, custom pulse CSS
- **Animations**: CSS `@keyframes`, GSAP / `@gsap/react`, `transitions-dev`
- **Backend / Edge Functions**: Cloudflare Pages Functions + Cloudflare D1 SQL database
- **Testing**: Playwright with TypeScript (Page Object Pattern, 128 tests)
- **Deployment**: Vercel (Frontend SPA) / Cloudflare Pages (Edge API)

---

## 📂 Project Structure

```
Homecare/
├── .impeccable/                 # Impeccable design system metadata sidecar
│   └── design.json
├── docs/                        # Specifications and design plans
├── functions/                   # Cloudflare Pages Functions
│   └── api/
│       └── bookings/
│           ├── index.ts         # POST /api/bookings (atomic 409 conflict guard)
│           └── availability.ts  # GET /api/bookings/availability?date=...
├── migrations/                  # Cloudflare D1 SQL schema migrations
│   └── 0001_initial_schema.sql
├── public/                      # Static assets & doctor images
├── src/
│   ├── api/                     # API client interface
│   ├── components/
│   │   ├── booking/             # MiniDoctorCard, etc.
│   │   ├── layout/              # MobileFrame, TopNavBar
│   │   ├── map/                 # MapPicker (Leaflet OpenStreetMap)
│   │   └── ui/                  # Button, Card, IosSwitch, StarRating, Stepper
│   ├── lib/                     # Motion utilities & cn helper
│   ├── pages/                   # 8 Application route screens
│   ├── services/                # API service with smart mock fallback
│   ├── store/                   # Zustand stores (bookingStore, reviewStore)
│   ├── styles/                  # globals.css with design tokens & tactile physics
│   ├── types/                   # TypeScript interfaces
│   └── utils/                   # Calendar & formatting helpers
├── tests/                       # Playwright E2E test specs (128 tests)
│   ├── pages/                   # Page Object Models
│   ├── booking-flow.spec.ts
│   ├── booking-steps-1-2.spec.ts
│   ├── home-and-profile.spec.ts
│   ├── navigation.spec.ts
│   ├── review-flow.spec.ts
│   └── store.spec.ts
├── DESIGN.md                    # Official Design System Specification
├── CHANGELOG.md                 # Project version changelog
├── package.json
├── tailwind.config.js
├── vercel.json                  # SPA routing configuration for Vercel
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dendyadinirwana/corina-homecare.git
cd corina-homecare

# Install dependencies
npm install
```

### Development Server

```bash
# Start standard Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Full-Stack Local Edge (with Cloudflare D1 database)

```bash
# Apply local D1 schema migration
npm run d1:migrate:local

# Start Cloudflare Pages local emulator with D1 binding
npm run dev:pages
```

### Production Build

```bash
npm run build
```

---

## 🧪 Testing

Comprehensive end-to-end tests are implemented using **Playwright** with the Page Object Pattern:

```bash
# Run all Playwright tests
npm run test:e2e

# Run specific test suites
npx playwright test tests/booking-flow.spec.ts
npx playwright test tests/home-and-profile.spec.ts
npx playwright test tests/review-flow.spec.ts
```

**Test Coverage Highlights:**
- ✅ 128/128 tests passing across Desktop & Mobile Safari/Chrome viewports
- ✅ Touch target compliance (minimum 44×44px hit-box verification)
- ✅ Stepper transitions and draft data persistence
- ✅ Leaflet map radar pulse and GPS location picking
- ✅ Slot availability, atomic conflict dialogs, and recovery flows
- ✅ RFC 5545 iCalendar (`.ics`) file generation and safe download trigger
- ✅ Review rating updates and anonymous patient toggle

---

## 🚢 Deployment

### Deploy to Vercel
The project includes a pre-configured `vercel.json` with SPA routing rewrites:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deploy to Cloudflare Pages (with D1 Database)
```bash
# Deploy via Wrangler
npx wrangler pages deploy dist
```

---

## 📄 License

MIT License © 2026 [Dendy Adi Nirwana](https://github.com/dendyadinirwana).

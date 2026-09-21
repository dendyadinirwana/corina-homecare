# Cloudflare Pages + D1 Database Booking Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy Corina Wulandari Homecare on Cloudflare Pages with Cloudflare D1 edge SQLite database, implementing an atomic zero-collision (anti-bentrok) booking mechanism.

**Architecture:** Fullstack Cloudflare Pages + Pages Functions monorepo. React 18 frontend communicates with `/functions/api/bookings` edge endpoints backed by Cloudflare D1. Atomic concurrency guard is enforced via SQLite `CONSTRAINT unique_booking_slot UNIQUE (date, time)`, combined with real-time UI slot availability fetching that disables occupied timeslots.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Cloudflare Pages Functions, Cloudflare D1 (SQLite), Wrangler CLI, Playwright.

**Spec:** [`docs/superpowers/specs/2026-09-21-cloudflare-d1-booking-design.md`](file:///Users/dendyadinirwana/Documents/Homecare/docs/superpowers/specs/2026-09-21-cloudflare-d1-booking-design.md)

## Global Constraints

- Touch targets must remain $\ge 44 \times 44\text{px}$ (`min-h-[44px]`).
- Apple iOS HIG aesthetic without simulated chrome (no fake status bar / no home indicator).
- Strict atomic collision prevention: no two confirmed appointments can share the same `(date, time)`.
- Smart fallback: if edge D1 is unavailable (e.g. static Vite dev / offline tests), frontend falls back gracefully to in-memory/localStorage mock store.
- Playwright tests must use TypeScript, soft assertions (`expect.soft`), and `getByTestId` / `getByRole` exclusively (no CSS class selectors).

---

### Task 1: D1 Database Migrations, Wrangler Configuration, & Cloudflare Tooling

**Files:**
- Create: `migrations/0001_initial_schema.sql`
- Create: `wrangler.jsonc`
- Modify: `package.json`
- Test: `tests/api/d1-schema.spec.ts`

**Interfaces:**
- Produces: `migrations/0001_initial_schema.sql` (SQLite DDL), `wrangler.jsonc` (Pages + D1 configuration).

- [ ] **Step 1: Write the failing test for schema file existence and DDL constraints**

```typescript
// tests/api/d1-schema.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Task 1: D1 Database Schema & Wrangler Configuration', () => {
  test('migrations schema file exists and defines bookings table with unique constraint', () => {
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_initial_schema.sql');
    expect.soft(fs.existsSync(migrationPath)).toBe(true);

    const schemaContent = fs.readFileSync(migrationPath, 'utf-8');
    expect.soft(schemaContent).toContain('CREATE TABLE IF NOT EXISTS bookings');
    expect.soft(schemaContent).toContain('CONSTRAINT unique_booking_slot UNIQUE (date, time)');
    expect.soft(schemaContent).toContain('idx_bookings_date');
  });

  test('wrangler configuration file exists with D1 database binding', () => {
    const wranglerPath = path.resolve(process.cwd(), 'wrangler.jsonc');
    expect.soft(fs.existsSync(wranglerPath)).toBe(true);

    const wranglerContent = fs.readFileSync(wranglerPath, 'utf-8');
    expect.soft(wranglerContent).toContain('"binding": "DB"');
    expect.soft(wranglerContent).toContain('"database_name": "homecare-db"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/api/d1-schema.spec.ts`
Expected: FAIL with missing files.

- [ ] **Step 3: Implement `migrations/0001_initial_schema.sql`**

```sql
-- migrations/0001_initial_schema.sql
-- Cloudflare D1 SQLite Schema for Corina Wulandari Homecare Bookings

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,                     -- YYYY-MM-DD
    time TEXT NOT NULL,                     -- HH:mm
    service_type TEXT NOT NULL,             -- 'homecare' | 'teleconsultation'
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT,
    lat REAL,
    lng REAL,
    complaint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'cancelled'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    -- Jaminan Atomik Anti-Bentrok
    CONSTRAINT unique_booking_slot UNIQUE (date, time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at);
```

- [ ] **Step 4: Implement `wrangler.jsonc` & update `package.json` scripts**

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "corina-homecare",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2024-09-21",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "homecare-db",
      "database_id": "homecare-db-local"
    }
  ]
}
```

Add scripts in `package.json`:
- `"d1:migrate:local": "wrangler d1 execute homecare-db --local --file=./migrations/0001_initial_schema.sql"`
- `"dev:pages": "wrangler pages dev dist --d1 DB=homecare-db"`

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx playwright test tests/api/d1-schema.spec.ts`
Expected: PASS (2/2 tests pass).

- [ ] **Step 6: Commit**

```bash
git add migrations/ wrangler.jsonc package.json tests/api/d1-schema.spec.ts
git commit -m "feat(d1): configure Cloudflare D1 schema, wrangler config, and migration scripts"
```

---

### Task 2: Cloudflare Pages Functions Booking API (`/api/bookings` & `/api/bookings/availability`)

**Files:**
- Create: `functions/types.ts`
- Create: `functions/api/bookings/availability.ts`
- Create: `functions/api/bookings/index.ts`
- Test: `tests/api/bookings-endpoints.spec.ts`

**Interfaces:**
- Consumes: `DB: D1Database` binding.
- Produces:
  - `GET /api/bookings/availability?date=YYYY-MM-DD` -> `{ date: string, bookedTimes: string[] }`
  - `GET /api/bookings` -> `{ bookings: BookingRow[] }`
  - `POST /api/bookings` -> `201 Created` with `{ success: true, bookingId: string }` or `409 Conflict` with `{ error: 'SLOT_ALREADY_BOOKED', message: string }`.

- [ ] **Step 1: Write the failing test for endpoints logic**

```typescript
// tests/api/bookings-endpoints.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Task 2: Cloudflare Pages Functions API Definitions', () => {
  test('functions/types.ts defines Cloudflare Pages Env and BookingRow interfaces', () => {
    const typesPath = path.resolve(process.cwd(), 'functions/types.ts');
    expect.soft(fs.existsSync(typesPath)).toBe(true);
    const content = fs.readFileSync(typesPath, 'utf-8');
    expect.soft(content).toContain('interface Env');
    expect.soft(content).toContain('DB: D1Database');
  });

  test('availability.ts exports onRequestGet returning booked times', () => {
    const availPath = path.resolve(process.cwd(), 'functions/api/bookings/availability.ts');
    expect.soft(fs.existsSync(availPath)).toBe(true);
    const content = fs.readFileSync(availPath, 'utf-8');
    expect.soft(content).toContain('onRequestGet');
    expect.soft(content).toContain('SELECT time FROM bookings');
  });

  test('bookings/index.ts handles atomic insert and catches SQLITE_CONSTRAINT with 409', () => {
    const indexPath = path.resolve(process.cwd(), 'functions/api/bookings/index.ts');
    expect.soft(fs.existsSync(indexPath)).toBe(true);
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect.soft(content).toContain('onRequestGet');
    expect.soft(content).toContain('onRequestPost');
    expect.soft(content).toContain('INSERT INTO bookings');
    expect.soft(content).toContain('409');
    expect.soft(content).toContain('SLOT_ALREADY_BOOKED');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/api/bookings-endpoints.spec.ts`
Expected: FAIL with files missing.

- [ ] **Step 3: Implement `functions/types.ts`**

```typescript
// functions/types.ts
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: Record<string, unknown>;
}

export interface Env {
  DB: D1Database;
}

export interface BookingRow {
  id: string;
  date: string;
  time: string;
  service_type: string;
  patient_name: string;
  patient_phone: string;
  address: string;
  landmark?: string | null;
  lat?: number | null;
  lng?: number | null;
  complaint: string;
  status: string;
  created_at: string;
}
```

- [ ] **Step 4: Implement `functions/api/bookings/availability.ts`**

```typescript
// functions/api/bookings/availability.ts
import type { Env, BookingRow } from '../../types';

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const url = new URL(context.request.url);
  const date = url.searchParams.get('date');

  if (!date) {
    return new Response(
      JSON.stringify({ error: 'MISSING_DATE', message: 'Parameter query date wajib diisi (YYYY-MM-DD)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { results } = await context.env.DB
      .prepare('SELECT time FROM bookings WHERE date = ? AND status = ? ORDER BY time ASC')
      .bind(date, 'confirmed')
      .all<Pick<BookingRow, 'time'>>();

    const bookedTimes = (results || []).map((row) => row.time);

    return new Response(
      JSON.stringify({ date, bookedTimes }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'DB_ERROR', message: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 5: Implement `functions/api/bookings/index.ts`**

```typescript
// functions/api/bookings/index.ts
import type { Env, BookingRow } from '../../types';

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const date = url.searchParams.get('date');

    let query = 'SELECT * FROM bookings';
    const params: unknown[] = [];

    if (date) {
      query += ' WHERE date = ? ORDER BY time ASC';
      params.push(date);
    } else {
      query += ' ORDER BY date DESC, time ASC LIMIT 50';
    }

    const statement = context.env.DB.prepare(query);
    const { results } = await (params.length ? statement.bind(...params) : statement).all<BookingRow>();

    return new Response(
      JSON.stringify({ bookings: results || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'DB_ERROR', message: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json();
    const {
      id,
      date,
      time,
      serviceType,
      patientName,
      patientPhone,
      address,
      landmark,
      coordinates,
      complaint,
    } = body;

    // Basic validation
    if (!date || !time || !patientName || !patientPhone || !address || !complaint) {
      return new Response(
        JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Data reservasi belum lengkap. Mohon lengkapi seluruh kolom wajib.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const bookingId = id || `BOOK-${date.replace(/-/g, '')}-${time.replace(':', '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Atomic insert with UNIQUE constraint guard
    await context.env.DB
      .prepare(`
        INSERT INTO bookings (
          id, date, time, service_type, patient_name, patient_phone,
          address, landmark, lat, lng, complaint, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', datetime('now'))
      `)
      .bind(
        bookingId,
        date,
        time,
        serviceType || 'homecare',
        patientName.trim(),
        patientPhone.trim(),
        address.trim(),
        landmark ? landmark.trim() : null,
        coordinates?.lat || null,
        coordinates?.lng || null,
        complaint.trim()
      )
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        bookingId,
        message: 'Reservasi berhasil dikonfirmasi dan tersimpan di database.',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    // Check for SQLite UNIQUE constraint collision
    if (errorMsg.includes('UNIQUE constraint failed') || errorMsg.includes('SQLITE_CONSTRAINT')) {
      return new Response(
        JSON.stringify({
          error: 'SLOT_ALREADY_BOOKED',
          message: 'Maaf, slot jadwal pada jam ini baru saja diambil oleh pasien lain. Silakan pilih jam kunjungan yang lain.',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'SERVER_ERROR', message: errorMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx playwright test tests/api/bookings-endpoints.spec.ts`
Expected: PASS (3/3 tests pass).

- [ ] **Step 7: Commit**

```bash
git add functions/ tests/api/bookings-endpoints.spec.ts
git commit -m "feat(api): implement Cloudflare Pages Functions for bookings and slot availability with 409 collision guard"
```

---

### Task 3: Frontend API Client & Fallback Cerdas (`src/services/api.ts`)

**Files:**
- Create: `src/services/api.ts`
- Test: `tests/api/api-client.spec.ts`

**Interfaces:**
- Consumes: Browser `fetch`, `localStorage`
- Produces:
  - `fetchSlotAvailability(date: string): Promise<string[]>`
  - `submitBooking(draft: BookingDraft): Promise<{ success: boolean; bookingId: string; error?: string; message?: string }>`
  - `clearMockBookings(): void`

- [ ] **Step 1: Write the failing test for API client**

```typescript
// tests/api/api-client.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task 3: Frontend API Client & Smart Fallback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('fetches availability with smart fallback when running locally', async ({ page }) => {
    const availability = await page.evaluate(async () => {
      const { fetchSlotAvailability } = await import('/src/services/api.ts');
      return await fetchSlotAvailability('2024-06-25');
    });

    expect.soft(Array.isArray(availability)).toBe(true);
  });

  test('submitting a duplicate booking triggers collision detection', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { submitBooking, clearMockBookings } = await import('/src/services/api.ts');
      clearMockBookings();

      const bookingData = {
        date: '2024-06-25',
        time: '11:00',
        serviceType: 'homecare' as const,
        patientName: 'Pasien A',
        patientPhone: '+6281234567890',
        address: 'Jl. Test No. 1',
        complaint: 'Demam',
      };

      const res1 = await submitBooking(bookingData);
      const res2 = await submitBooking(bookingData); // duplicate
      return { res1, res2 };
    });

    expect.soft(result.res1.success).toBe(true);
    expect.soft(result.res2.success).toBe(false);
    expect.soft(result.res2.error).toBe('SLOT_ALREADY_BOOKED');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/api/api-client.spec.ts`
Expected: FAIL because `/src/services/api.ts` does not exist.

- [ ] **Step 3: Implement `src/services/api.ts`**

```typescript
// src/services/api.ts
import type { BookingDraft } from '../types';

const MOCK_STORAGE_KEY = 'homecare_d1_mock_bookings';

interface StoredMockBooking {
  id: string;
  date: string;
  time: string;
  patientName: string;
}

function getLocalMockBookings(): StoredMockBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMockBooking(booking: StoredMockBooking): boolean {
  if (typeof window === 'undefined') return false;
  const list = getLocalMockBookings();
  // Anti-collision check in mock store
  if (list.some((b) => b.date === booking.date && b.time === booking.time)) {
    return false;
  }
  list.push(booking);
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(list));
  return true;
}

export function clearMockBookings(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
}

/**
 * Fetches booked time slots for a given date.
 */
export async function fetchSlotAvailability(date: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`);
    if (response.ok) {
      const data = await response.json();
      return data.bookedTimes || [];
    }
  } catch {
    // Edge API not available (e.g. running in standard Vite dev) -> fallback to smart mock
  }

  // Fallback: read from mock storage
  const mockList = getLocalMockBookings();
  return mockList.filter((b) => b.date === date).map((b) => b.time);
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  message?: string;
}

/**
 * Submits a new booking to the Cloudflare D1 endpoint with anti-collision guard.
 */
export async function submitBooking(draft: Partial<BookingDraft>): Promise<BookingResponse> {
  const bookingId = `BOOK-${(draft.date || '').replace(/-/g, '')}-${(draft.time || '').replace(':', '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: bookingId,
        ...draft,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      return { success: true, bookingId: data.bookingId || bookingId, message: data.message };
    }

    if (response.status === 409) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || 'SLOT_ALREADY_BOOKED',
        message: data.message || 'Slot jadwal pada jam ini sudah dipesan oleh pasien lain.',
      };
    }
  } catch {
    // Fallback: mock store execution with collision detection
  }

  // Fallback collision check
  const saved = saveLocalMockBooking({
    id: bookingId,
    date: draft.date || '',
    time: draft.time || '',
    patientName: draft.patientName || '',
  });

  if (!saved) {
    return {
      success: false,
      error: 'SLOT_ALREADY_BOOKED',
      message: `Slot jam ${draft.time} pada tanggal ${draft.date} sudah dipesan oleh pasien lain. Silakan pilih jam lain.`,
    };
  }

  return {
    success: true,
    bookingId,
    message: 'Reservasi berhasil dikonfirmasi.',
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx playwright test tests/api/api-client.spec.ts`
Expected: PASS (2/2 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/services/api.ts tests/api/api-client.spec.ts
git commit -m "feat(api): implement frontend API service with smart mock fallback and collision prevention"
```

---

### Task 4: Frontend Step 2 Integration (Real-time Slot Availability & Disabled State)

**Files:**
- Modify: `src/pages/BookingStep2Page.tsx`
- Test: `tests/e2e/booking-availability.spec.ts`

**Interfaces:**
- Consumes: `fetchSlotAvailability` from `src/services/api.ts`, `useBookingStore`.
- Produces: Visual slot status (available vs. booked), disabled state, and badge `"Terisi"`.

- [ ] **Step 1: Write the failing test for slot disabled state**

```typescript
// tests/e2e/booking-availability.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task 4: Booking Step 2 Real-time Slot Availability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/booking/langkah-2');
  });

  test('renders time slot sections and respects booked slots', async ({ page }) => {
    // Seed a booked slot for 2024-06-25 at 09:00
    await page.evaluate(() => {
      localStorage.setItem(
        'homecare_d1_mock_bookings',
        JSON.stringify([
          { id: 'BOOK-TEST-1', date: '2024-06-25', time: '09:00', patientName: 'Test' },
        ])
      );
    });

    // Reload page to trigger availability fetch
    await page.reload();

    const bookedBtn = page.getByTestId('time-slot-09:00');
    await expect.soft(bookedBtn).toBeVisible();
    await expect.soft(bookedBtn).toBeDisabled();
    await expect.soft(bookedBtn).toContainText('Terisi');

    // Available slot 11:00 can be clicked
    const availableBtn = page.getByTestId('time-slot-11:00');
    await expect.soft(availableBtn).toBeEnabled();
    await availableBtn.click();
    await expect.soft(availableBtn).toHaveAttribute('data-active', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/booking-availability.spec.ts`
Expected: FAIL because `time-slot-09:00` is not yet disabled.

- [ ] **Step 3: Modify `src/pages/BookingStep2Page.tsx` to query availability and disable booked slots**

Update `BookingStep2Page.tsx`:
- Add `bookedSlots` state (`useState<string[]>([])`).
- Add `useEffect` querying `fetchSlotAvailability(selectedDate)`.
- If current selected time is inside `bookedSlots`, reset selected time to empty string.
- In slot button render loop:
  - Calculate `isBooked = bookedSlots.includes(slot.time)`.
  - Pass `disabled={isBooked}`.
  - Render small badge `"Terisi"` when `isBooked` is true.
  - Apply `opacity-50 cursor-not-allowed bg-card border-border-hairline text-ink-muted line-through`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/e2e/booking-availability.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BookingStep2Page.tsx tests/e2e/booking-availability.spec.ts
git commit -m "feat(booking): disable occupied time slots on Step 2 with real-time availability check"
```

---

### Task 5: Frontend Step 3 Integration (Collision Conflict Dialog & Resilient Booking Flow)

**Files:**
- Modify: `src/pages/BookingStep3Page.tsx`
- Test: `tests/e2e/booking-collision.spec.ts`

**Interfaces:**
- Consumes: `submitBooking` from `src/services/api.ts`.
- Produces: Conflict alert modal on 409, clean redirect on 201.

- [ ] **Step 1: Write the failing test for collision modal**

```typescript
// tests/e2e/booking-collision.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task 5: Booking Step 3 Concurrency Collision Guard', () => {
  test('displays conflict dialog and redirect button when slot collision occurs', async ({ page }) => {
    await page.goto('/booking/langkah-3');

    // Simulate that slot was just taken by someone else right before confirming
    await page.evaluate(() => {
      localStorage.setItem(
        'homecare_d1_mock_bookings',
        JSON.stringify([
          { id: 'COLLISION-1', date: '2024-06-25', time: '11:00', patientName: 'Orang Lain' },
        ])
      );
    });

    // Attempt to confirm the same slot
    const confirmBtn = page.getByTestId('btn-confirm-booking');
    await confirmBtn.click();

    // Conflict dialog should appear
    const conflictModal = page.getByTestId('modal-slot-conflict');
    await expect.soft(conflictModal).toBeVisible();
    await expect.soft(conflictModal).toContainText('Jadwal Sudah Terisi');

    // Button to re-select slot navigates back to Step 2
    const changeSlotBtn = page.getByTestId('btn-reselect-slot');
    await expect.soft(changeSlotBtn).toBeVisible();
    await changeSlotBtn.click();
    await expect.soft(page).toHaveURL(/\/booking\/langkah-2/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/booking-collision.spec.ts`
Expected: FAIL because conflict dialog does not exist.

- [ ] **Step 3: Modify `src/pages/BookingStep3Page.tsx`**

Update `BookingStep3Page.tsx`:
- Add `conflictError` state (`string | null`).
- In `handleConfirm`:
  - Call `await submitBooking(draftData)`.
  - If `result.success === false && result.error === 'SLOT_ALREADY_BOOKED'`:
    - Set `conflictError(result.message)`.
    - Stop execution.
  - If `result.success === true`:
    - Proceed to confirm in local Zustand store.
    - Open WhatsApp window.
    - Navigate to `/booking/konfirmasi`.
- Render `modal-slot-conflict` if `conflictError` is not null, with:
  - Title: *"Jadwal Sudah Terisi"*
  - Description: `conflictError` message
  - Button `btn-reselect-slot`: *"Pilih Jam Lain"* -> navigates to `/booking/langkah-2`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test tests/e2e/booking-collision.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BookingStep3Page.tsx tests/e2e/booking-collision.spec.ts
git commit -m "feat(booking): add atomic slot conflict dialog and recovery navigation on Step 3"
```

---

### Task 6: Full E2E Integration, Regression Suite, & Cloudflare Build Verification

**Files:**
- Modify: `tests/navigation.spec.ts`
- Test: All Playwright spec files (`npx playwright test`)
- Build: `npm run build`

**Interfaces:**
- Produces: Production bundle in `dist/`, 100% passing test suite across all 8 screens and edge APIs.

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Vite build succeeds with 0 TypeScript and CSS errors.

- [ ] **Step 2: Run full Playwright test suite**

Run: `npx playwright test`
Expected: All tests pass (including existing 104 tests + new D1 schema, API, availability, and collision tests).

- [ ] **Step 3: Verify visual flow in browser**

Use Playwright MCP to verify booking flow from Step 1 to Step 3 with active slot availability.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Cloudflare Pages and D1 booking anti-collision architecture"
```

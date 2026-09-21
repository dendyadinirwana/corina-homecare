# Spesifikasi Arsitektur: Cloudflare Pages + D1 Database untuk Reservasi Homecare Anti-Bentrok

## 1. Ringkasan Eksekutif
Dokumen ini mendefinisikan arsitektur sistem reservasi kunjungan medis **Corina Wulandari - Personal Health & Homecare** yang di-deploy pada **Cloudflare Pages** dengan database serverless edge **Cloudflare D1 (SQLite)**. Sistem ini menjamin integritas jadwal dengan **mekanisme anti-bentrok mutlak (zero-collision / no double-booking)** baik di sisi tampilan UI (pencegahan dini) maupun di sisi database (constraint atomik SQLite `UNIQUE(date, time)`).

---

## 2. Arsitektur Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge Network                         │
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │ Cloudflare Pages (SPA) │         │   Cloudflare Pages Functions  │  │
│  │   Vite + React + TS    │ ◄─────► │        (/functions/api)       │  │
│  └───────────┬────────────┘         └───────────────┬───────────────┘  │
│              │                                      │                  │
│              ▼                                      ▼                  │
│     Browser Client                   Cloudflare D1 (SQLite Edge DB)    │
│  (UI Slot Availability)              (UNIQUE Constraint & Atomicity)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Komponen Inti:
1. **Frontend**: SPA React 18 + Vite + TypeScript + Tailwind CSS (`dist/`), dihosting langsung di Cloudflare Pages.
2. **Serverless Edge API**: Cloudflare Pages Functions (`/functions/api/bookings`), dieksekusi di edge runtime V8 tanpa container/server fisik.
3. **Database**: Cloudflare D1 instance (`homecare-db`), database relasional SQLite edge dengan latensi rendah dan transaksi atomik.
4. **Mekanisme Anti-Bentrok**:
   - Level UI: Query ketersediaan jadwal slot per tanggal (`/api/bookings/availability?date=YYYY-MM-DD`), menonaktifkan slot yang sudah terisi.
   - Level Database: `CONSTRAINT unique_booking_slot UNIQUE (date, time)` mencegah dua proses memasukkan jadwal yang sama secara bersamaan (race condition guard).

---

## 3. Skema Database D1 (SQLite DDL)

Lokasi file: `migrations/0001_initial_schema.sql`

```sql
-- Tabel Reservasi Pasien
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,                           -- UUID / BOOK-xxx
    date TEXT NOT NULL,                            -- Format: YYYY-MM-DD (misal: 2024-06-25)
    time TEXT NOT NULL,                            -- Format: HH:mm (misal: 09:00, 11:00)
    service_type TEXT NOT NULL,                    -- 'homecare' | 'teleconsultation'
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT,
    lat REAL,
    lng REAL,
    complaint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',       -- 'confirmed' | 'cancelled'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Jaminan Atomik Anti-Bentrok:
    -- Mencegah entri ganda untuk tanggal dan jam yang sama jika status confirmed
    CONSTRAINT unique_booking_slot UNIQUE (date, time)
);

-- Indeks untuk efisiensi query ketersediaan tanggal
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at);
```

---

## 4. Spesifikasi API (Pages Functions)

### 4.1. `GET /api/bookings/availability`
- **Tujuan**: Mengambil slot jam yang sudah dipesan untuk suatu tanggal tertentu.
- **Query Parameter**: `date=YYYY-MM-DD`
- **Query D1**:
  ```sql
  SELECT time FROM bookings WHERE date = ? AND status = 'confirmed';
  ```
- **Response `200 OK`**:
  ```json
  {
    "date": "2024-06-25",
    "bookedTimes": ["11:00", "14:00"]
  }
  ```

### 4.2. `POST /api/bookings`
- **Tujuan**: Membuat reservasi baru secara atomik.
- **Request Body**:
  ```json
  {
    "id": "BOOK-20240625-1100-XYZ",
    "date": "2024-06-25",
    "time": "11:00",
    "serviceType": "homecare",
    "patientName": "Budi Santoso (58 thn)",
    "patientPhone": "+62 812-8921-4450",
    "address": "Jl. Bintaro Utama Sektor 7, Tangerang Selatan",
    "landmark": "Rumah Pagar Hitam No. 12",
    "coordinates": { "lat": -6.2841, "lng": 106.7265 },
    "complaint": "Demam tinggi 3 hari, lemas & riwayat hipertensi"
  }
  ```
- **Query D1**:
  ```sql
  INSERT INTO bookings (
    id, date, time, service_type, patient_name, patient_phone,
    address, landmark, lat, lng, complaint, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', datetime('now'));
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "bookingId": "BOOK-20240625-1100-XYZ",
    "message": "Reservasi berhasil dikonfirmasi"
  }
  ```
- **Response `409 Conflict` (Jika bentrok / sudah terisi)**:
  ```json
  {
    "success": false,
    "error": "SLOT_ALREADY_BOOKED",
    "message": "Slot jam 11:00 pada tanggal 25 Juni 2024 sudah dipesan oleh pasien lain. Silakan pilih jam lain."
  }
  ```

### 4.3. `GET /api/bookings`
- **Tujuan**: Mengambil daftar reservasi (opsional filter parameter `date` atau `limit`).
- **Response `200 OK`**:
  ```json
  {
    "bookings": [ ... ]
  }
  ```

---

## 5. Integrasi Frontend

### 5.1. Klien API & Fallback Cerdas (`src/services/api.ts`)
- Berisi fungsi `fetchSlotAvailability(date: string)` dan `createBooking(draft: BookingDraft)`.
- Menggunakan `fetch('/api/bookings/...')`.
- Jika backend edge tidak aktif (misal running via static `npm run preview` tanpa D1 binding), fallback cerdas otomatis aktif menggunakan mock in-memory / local storage agar fungsionalitas UI tetap dapat diuji tanpa crash.

### 5.2. Layar 4 (Langkah 2: Jam Kunjungan - `BookingStep2Page.tsx`)
- Menjalankan `fetchSlotAvailability(selectedDate)`.
- Tombol waktu slot yang tercantum dalam `bookedTimes`:
  - Di-disable (`disabled={isBooked}`).
  - Memiliki styling muted (`bg-surface-secondary text-ink-muted cursor-not-allowed line-through opacity-60`).
  - Menampilkan badge kecil `"Terisi"`.
  - Jika jam yang sebelumnya tersimpan di store ternyata sudah terisi, otomatis me-reset pilihan jam dan mewajibkan pasien memilih slot yang kosong.

### 5.3. Layar 5 (Langkah 3: Data Pasien & Konfirmasi - `BookingStep3Page.tsx`)
- Saat tombol *Konfirmasi Janji Temu via WhatsApp* ditekan:
  - Mengirim `POST /api/bookings`.
  - Jika berhasil (`201`):
    - Simpan ke Zustand booking store.
    - Buka WhatsApp dokter dengan nomor `+62 877-7207-7213`.
    - Navigasi ke `/booking/konfirmasi`.
  - Jika bentrok (`409 Conflict`):
    - Tampilkan peringatan dialog/modal bentrok jadwal (*"Slot jam ini baru saja diambil pasien lain"*).
    - Berikan tombol aksi langsung untuk kembali ke Langkah 2 memilih jam yang baru.

---

## 6. Konfigurasi Wrangler & Deployment

File `wrangler.jsonc`:
```jsonc
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

Scripts di `package.json`:
- `"d1:migrate:local": "wrangler d1 execute homecare-db --local --file=./migrations/0001_initial_schema.sql"`
- `"dev:pages": "wrangler pages dev dist --d1 DB=homecare-db"`
- `"deploy": "npm run build && wrangler pages deploy dist"`

---

## 7. Rencana Verifikasi & Testing
1. **Pengujian Unit & Edge Migrasi SQLite**:
   - Memastikan DDL tabel `bookings` tereksekusi tanpa error.
   - Menguji constraint `UNIQUE(date, time)` menolak duplikasi slot.
2. **Pengujian Concurrency & Collision**:
   - Mengirim 2 permintaan simultan ke slot yang sama, memverifikasi respon 201 untuk yang pertama dan 409 untuk yang kedua.
3. **Pengujian UI Playwright**:
   - Memverifikasi slot terisi tampil disabled pada Layar 2.
   - Memverifikasi error handling ramah pada Layar 3 jika terjadi bentrok.
4. **Regresi Penuh**:
   - Seluruh 104 pengujian yang sudah ada harus tetap 100% lulus.

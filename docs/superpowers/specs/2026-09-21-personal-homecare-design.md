# Design Specification: Personal Doctor Homecare Mobile Web App

- **Date**: 2026-09-21
- **Project**: Corina Wulandari - Personal Health & Homecare
- **Reference**: `homecare.pen` (pen.dev) & `AGENTIC_CODING_PROMPT.md`
- **Target Device/Layout**: Mobile-First Apple iOS HIG Responsive (Centered 393px-420px mobile frame on desktop, 100vw on mobile devices)

---

## 1. Overview & Goals

Membangun aplikasi web mobile-first *production-ready* untuk praktik mandiri personal homecare dokter bernama **"Corina Wulandari - Personal Health & Homecare"**. Aplikasi dirancang mengikuti standar estetika **Apple iOS Human Interface Guidelines (HIG)** dengan tipografi bersih (*Inter / SF Pro*), sudut membulat konsentris (*concentric border-radius*), touch targets minimal 44x44px, dan sistem transisi halus dari **`transitions-dev`**.

Aplikasi mencakup 8 layar utama, sistem pemesanan (*booking wizard*) 3 tahap dengan integrasi geolokasi peta Leaflet (OpenStreetMap), serta sistem ulasan pasien dengan persistensi browser (`localStorage`).

---

## 2. Tech Stack & Architecture

- **Runtime & Framework**: React 18+ with Vite (TypeScript)
- **Routing**: `react-router-dom` v6
- **Styling**: Tailwind CSS v3 dengan Semantic CSS Variables & Design Tokens kustom
- **Iconography**: `lucide-react` (stroke 2px seragam)
- **State Management**: `zustand` dengan middleware `persist` (`localStorage`)
- **Interactive Map & GPS**: `leaflet` + `react-leaflet` + OpenStreetMap tiles layer
- **Calendar Event Export**: Zero-dependency iCalendar (.ics) generator untuk Google Calendar / Apple Calendar
- **Testing Framework**: Playwright with TypeScript (Page Object Pattern, `getByRole` / `getByTestId`, soft assertions)

---

## 3. Design Tokens & Motion (`transitions-dev`)

### 3.1 Color Palette
```css
:root {
  /* Surface & Backgrounds */
  --bg-canvas: #F2F2F7;
  --bg-surface: #FFFFFF;
  --bg-card: #F8F8FA;
  --bg-card-hover: #F0F0F3;
  --border-subtle: #F0F0F2;
  --border-hairline: #E5E7EB;

  /* Typography & Ink */
  --text-primary: #000000;
  --text-secondary: #555555;
  --text-muted: #8E8E93;
  --text-inverse: #FFFFFF;

  /* Accent Colors */
  --accent-lime: #D4F636;        /* Signature Primary CTA */
  --accent-lime-hover: #C2E22E;
  --accent-forest: #1E3322;      /* Deep Clinical Green */
  --accent-forest-light: #E8F8EE; /* Pill Status Background */
  --accent-green-dot: #34C759;   /* Live Availability Dot */
  --whatsapp-green: #25D366;

  /* Motion Tokens (transitions-dev) */
  --duration-micro: 80ms;
  --duration-quick: 150ms;
  --duration-fast: 250ms;
  --duration-medium: 350ms;
  --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);
  --scale-press: 0.96;
}
```

### 3.2 Motion Classes & Micro-Interactions
- `.btn-tactile`: Active press feedback with `transform: scale(var(--scale-press))` and smooth spring transition.
- **Success Checkmark Entrance**: Pop-in scale (`0.8 -> 1`) + SVG checkmark path stroke animation on confirmation page.
- **Step Navigation Transition**: Smooth horizontal content translation across booking steps.
- **Star Rating Bounce**: Micro spring bounce feedback on star selection.
- **GPS Radar Pulse**: Pulsing ring wave indicator around the coordinate pinpoint.

---

## 4. Eight Screen Detailed Specifications

### Layar 1: Beranda & Bio-Link Hub (`/`)
- **Header**: iOS Status Bar (9:41, Wi-Fi, sinyal, baterai) dan Apple Dynamic Island (124×35px).
- **Profil Dokter**:
  - Foto dokter bulat 92×92px (`/doctor-profile.jpg`) dengan ring putih 3.5px & bayangan halus.
  - Status Pill: `• Menerima Kunjungan Hari Ini • Tiba 30 Menit` (latar `#E8F8EE`, teks `#1E3322`).
  - Nama: **Corina Wulandari**.
  - Spesialisasi: *Dokter Spesialis Penyakit Dalam & Layanan Homecare*.
  - Izin: *SIP No. 446.1/1082/SIP.D/2022 • IDI Tangerang Selatan*.
  - Badges: `FK UI / Sp.PD` | `10+ Thn Pengalaman` | `4.9 ★ (180+ Pasien)`.
- **Emergency WhatsApp Card**:
  - Direct WhatsApp link (`https://wa.me/6281234567890?text=Halo%20Dokter%20Corina,%20saya%20memerlukan%20tindakan%20homecare`), status aktif siaga 24 jam.
- **4 Kartu Layanan Homecare**:
  1. *Kunjungan Rumah* (Pemeriksaan umum & resep) ➔ CTA Button Lime `Pesan` mengarah ke `/booking/langkah-1`.
  2. *Pemeriksaan Lansia & Kronis* (Cek tensi, gula darah & rekam jantung) ➔ Chevron.
  3. *Pengambilan Darah & Lab* (Sampel di rumah, hasil digital cepat) ➔ Chevron.
  4. *Perawatan Luka & Jahitan* (Ganti perban steril & lepas benang) ➔ Chevron.
- **Footer**: *Domisili & Wilayah Kunjungan: Tangerang Selatan & Sekitarnya*.

### Layar 2: Profil & Detail Klinis (`/profil`)
- **Hero Photo Section**: Foto dokter portrait penuh dengan tombol navigasi Back, Favorite, dan More.
- **Pills Kontak Cepat**: Telepon (`0812-3456-7890`), Email (`corina@healthrate.id`), Domisili (`Tangerang Selatan`).
- **AI Summary**: Rangkuman kepuasan pasien atas ketepatan diagnosa dan empati pelayanan.
- **3 Kartu Metrik**: Waktu Tunggu (`4.63★`), Sikap & Empati (`4.19★`), Penjelasan Medis (`4.74★`).
- **Visual Donut Chart Kasus**: Hipertensi (35%), Kardiologi Preventif (25%), Pemantauan Gagal Jantung (22%), Evaluasi Nyeri Dada (18%).
- **Sticky Booking Footer**: Biaya konsultasi `Rp 250.000` + Tombol CTA Lime `Jadwalkan Kunjungan` menuju `/booking/langkah-1`.

### Layar 3: Buat Janji - Langkah 1 Tanggal & Jenis Layanan (`/booking/langkah-1`)
- **Progress Stepper**: `(1) Tanggal` [Aktif] — `(2) Waktu` — `(3) Detail`.
- **Mini Doctor Card**: Avatar Corina Wulandari, rating 4.9, 180+ pasien.
- **Kalender Horizontal 7 Hari**: Pilihan tanggal interaktif dengan indikator tanggal terpilih (misal: 25 Juni 2024).
- **Pilihan Jenis Layanan (Radio Box)**:
  - *Kunjungan Dokter ke Rumah* (Fisik, membawa alat medis & resep) — Terpilih default.
  - *Telekonsultasi Video* (Konsultasi daring via video call).
- **Sticky CTA**: `Lanjut Pilih Jam Kunjungan →` menuju `/booking/langkah-2`.

### Layar 4: Buat Janji - Langkah 2 Pilih Jam Kunjungan (`/booking/langkah-2`)
- **Progress Stepper**: `(1)` [Done] — `(2) Waktu` [Aktif] — `(3) Detail`.
- **Banner Tanggal Terpilih**: Menampilkan tanggal dari Langkah 1 + tombol `Ubah`.
- **Grid Slot Waktu (Pagi, Siang, Sore & Malam)**:
  - Pagi: `09:00`, `10:00`, `11:00` (terpilih default), `12:00`.
  - Siang: `13:00`, `14:00`, `15:00`, `16:00`.
  - Sore & Malam: `17:00`, `18:00`, `19:00`, `20:00`.
- **Info Notice**: Jam mengacu pada WIB, dokter hadir tepat waktu dengan peralatan steril.
- **Sticky CTA**: `Lanjut ke Data Pasien →` menuju `/booking/langkah-3`.

### Layar 5: Buat Janji - Langkah 3 Data Pasien & Geolocation (`/booking/langkah-3`)
- **Progress Stepper**: `(1) & (2)` [Done] — `(3) Data & Keluhan` [Aktif].
- **Form Input Data**:
  - Nama Lengkap Pasien (`Budi Santoso, 58 thn`).
  - Nomor WhatsApp Aktif (`+62 812-8921-4450`).
- **Fitur Geolocation & Map Picker**:
  - Tombol `⌖ Gunakan Lokasi Saat Ini` menggunakan `navigator.geolocation` browser.
  - Input teks alamat lengkap: `Jl. Bintaro Utama Sektor 7, Tangerang Selatan`.
  - Leaflet Map Preview dengan pin marker, radius akurasi ±3m, radar pulse effect, dan floating bar koordinat (`📍 GPS: -6.2841° S, 106.7265° E`).
  - Input Patokan: `Rumah Pagar Hitam No. 12, seberang Taman`.
- **Keluhan Medis & Riwayat**: Dropdown kategori keluhan + textarea rincian.
- **Live Ringkasan Janji Temu**: Card berisi rangkuman tanggal, jam, tipe layanan, dan alamat GPS.
- **Sticky CTA**: `Konfirmasi Janji Temu →` (menyimpan ke store & redirect ke `/booking/konfirmasi`).

### Layar 6: Janji Temu Dikonfirmasi (`/booking/konfirmasi`)
- **Header Modal**: Tombol `Selesai` & Close (X) menuju `/`.
- **Animasi Sukses**: Pop-in bouncing checkmark badge hijau lime (`#D4F636`).
- **Judul**: *Janji Temu Dikonfirmasi*.
- **Rincian Reservasi**: Card detail tanggal, jam, tipe kunjungan, dokter penanggung jawab, dan lokasi GPS akurat.
- **Notifikasi Box**: Konfirmasi pengiriman notifikasi email & WhatsApp reminder.
- **Aksi**:
  - `Tambah ke Kalender` (Generate `.ics` file untuk Google/Apple Calendar).
  - `Lihat Rincian Reservasi` (Modal toggle rincian).
  - `Kembali ke Beranda`.

### Layar 7: Daftar Ulasan Pasien (`/ulasan`)
- **Header Top Bar**: Back button, judul *Ulasan Pasien*, ikon filter/sort.
- **Skor Agregat**: `4.9 ★` (128 Ulasan, 99% Puas) dengan rating distribution progress bar.
- **3 Aspek Penilaian**: Ketepatan Waktu (4.8★), Sikap & Empati (4.9★), Penjelasan Medis (4.9★).
- **Filter Pills**: `Semua` | `Kunjungan Rumah` | `Rawat Lansia` | `Cek Lab`.
- **Feed Ulasan Pasien**: Inisial avatar, nama, verified badge, tanggal, teks ulasan mendalam, tombol "Membantu".
- **Sticky Bottom Action Bar**: Tombol `Tulis Ulasan` mengarah ke `/ulasan/tulis`.

### Layar 8: Formulir Tulis Ulasan (`/ulasan/tulis`)
- **Header Modal**: Close (X) button dan link *Bantuan*.
- **Summary Visit Card**: *Corina Wulandari • Kunjungan Medis ke Rumah • Kunjungan Selesai*.
- **5 Bintang Besar Interaktif**: Nilai rating interaktif dengan label responsif (*5.0 • Sangat Puas & Profesional*).
- **Sub-Rating 3 Aspek**: Ketepatan Waktu, Higienitas Alat, Keramahan Dokter.
- **Textarea Catatan Pengalaman**: Live character counter (`214/500`).
- **iOS Switch Toggle**: *Tampilkan sebagai Pasien Anonim* (menyembunyikan nama asli menjadi inisial).
- **Sticky CTA**: `Kirim Ulasan Sekarang` (langsung menambahkan review ke `reviewStore` dan redirect ke `/ulasan`).

---

## 5. State Management & Persistence

### 5.1 `useBookingStore` (Zustand)
- `draft`:
  - `date`: string (e.g. `2024-06-25`)
  - `time`: string (e.g. `11:00`)
  - `serviceType`: `'homecare' | 'teleconsultation'`
  - `patientName`: string
  - `patientPhone`: string
  - `address`: string
  - `landmark`: string
  - `coordinates`: `{ lat: number; lng: number }`
  - `complaint`: string
- `confirmedBooking`: Booking object | null
- `setDraft(partial: Partial<BookingDraft>): void`
- `confirmBooking(): void`
- `resetDraft(): void`

### 5.2 `useReviewStore` (Zustand)
- `reviews`: Array of Review items (seeded with initial 3 reviews from `homecare.pen`)
- `addReview(review: Omit<Review, 'id' | 'createdAt'>): void`
- `likeReview(id: string): void`

Both stores use Zustand's `persist` middleware configured with `name: 'homecare-booking-store'` and `name: 'homecare-review-store'`.

---

## 6. Testing & Quality Assurance Plan

### 6.1 Playwright E2E Test Suite
1. **`booking-flow.spec.ts`**:
   - Menavigasi dari Layar 1 ➔ Layar 3 ➔ Layar 4 ➔ Layar 5.
   - Mengisi data pasien, trigger geolocation stub/mock, submit janji temu.
   - Verifikasi halaman konfirmasi (Layar 6) menampilkan data yang sesuai dan tombol kalender aktif.
2. **`review-flow.spec.ts`**:
   - Membuka Layar 7 (`/ulasan`).
   - Klik `Tulis Ulasan` menuju Layar 8 (`/ulasan/tulis`).
   - Memilih 5 bintang, mengetik ulasan, menyalakan toggle anonim, submit.
   - Memverifikasi ulasan baru tertera di Layar 7 dengan label inisial anonim.
3. **`navigation.spec.ts`**:
   - Memverifikasi 8 rute halaman dapat diakses langsung tanpa crash.
   - Memverifikasi tampilan frame mobile 393px di desktop dan viewport mobile.
   - Memverifikasi tombol WhatsApp darurat memiliki URL target yang benar.

### 6.2 Browser Visual Verification
Menggunakan Playwright MCP tools (`browser_navigate`, `browser_take_screenshot`) untuk memvalidasi fidelity visual tiap layar terhadap file desain `homecare.pen`.

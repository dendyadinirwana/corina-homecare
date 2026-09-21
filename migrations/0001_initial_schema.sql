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

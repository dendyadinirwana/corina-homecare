import type { ConfirmedBooking } from '../types';

/**
 * Pads a single-digit number with leading zero
 */
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Formats a JavaScript Date object into RFC 5545 UTC timestamp (YYYYMMDDTHHMMSSZ)
 */
function formatUtcTimestamp(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates valid iCalendar (RFC 5545) VCALENDAR string from confirmed booking details.
 */
export function generateIcsContent(booking: ConfirmedBooking): string {
  // Parse date components (expected YYYY-MM-DD)
  const dateStr = booking.date || '2024-06-25';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10) || 2024;
  const month = parseInt(monthStr, 10) || 6;
  const day = parseInt(dayStr, 10) || 25;

  // Parse time components (expected HH:mm)
  const timeStr = booking.time || '11:00';
  const [hourStr, minStr] = timeStr.split(':');
  const startHour = parseInt(hourStr, 10) || 11;
  const startMin = parseInt(minStr, 10) || 0;

  // Construct JavaScript Date for start time (using local components)
  const startDate = new Date(year, month - 1, day, startHour, startMin, 0);
  // Add 1 hour (60 * 60 * 1000 ms) using Date arithmetic for safe month/year rollover
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const dtStart =
    startDate.getFullYear() +
    pad(startDate.getMonth() + 1) +
    pad(startDate.getDate()) +
    'T' +
    pad(startDate.getHours()) +
    pad(startDate.getMinutes()) +
    '00';

  const dtEnd =
    endDate.getFullYear() +
    pad(endDate.getMonth() + 1) +
    pad(endDate.getDate()) +
    'T' +
    pad(endDate.getHours()) +
    pad(endDate.getMinutes()) +
    '00';

  const dtStamp = formatUtcTimestamp(new Date());

  const uid = `${booking.id || Date.now()}@corina-homecare.id`;
  const summary = `Janji Temu Homecare: ${booking.patientName || 'Pasien'}`;

  const locationRaw = [
    booking.address || 'Tangerang Selatan',
    booking.landmark ? `(Patokan: ${booking.landmark})` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const location = locationRaw.replace(/[,;\\]/g, '\\$&');

  const doctorName =
    (typeof booking.doctor === 'object' && booking.doctor?.name) ||
    'dr. Corina Wulandari, Sp.PD';

  const serviceLabel =
    booking.serviceType === 'teleconsultation'
      ? 'Telekonsultasi Video'
      : 'Kunjungan Dokter ke Rumah';

  const descriptionLines = [
    `Layanan: ${serviceLabel}`,
    `Pasien: ${booking.patientName || '-'}`,
    `No. WhatsApp: ${booking.patientPhone || '-'}`,
    booking.complaint ? `Keluhan Medis: ${booking.complaint}` : '',
    `Dokter: ${doctorName}`,
    'Aplikasi: Corina Wulandari - Personal Health & Homecare',
  ].filter(Boolean);

  const description = descriptionLines.join('\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Corina Homecare//Personal Health & Homecare//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Safely triggers client-side download of the .ics calendar file.
 * Compatible with modern desktop and mobile browsers (iOS Safari, Android Chrome).
 */
export function downloadIcsFile(booking: ConfirmedBooking): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const icsData = generateIcsContent(booking);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const fileName = `janji-temu-homecare-${booking.date || 'jadwal'}.ics`;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke blob URL after a short timeout
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 500);
}

/**
 * Alias for task compatibility
 */
export const generateIcsFile = downloadIcsFile;

export const INDONESIAN_DAYS_LONG = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export const INDONESIAN_DAYS_SHORT = [
  'MIN',
  'SEN',
  'SEL',
  'RAB',
  'KAM',
  'JUM',
  'SAB',
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function formatDateToYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseYmdDate(dateStr: string): Date {
  const [yearStr, monthStr, dayStr] = (dateStr || '2024-06-25').split('-');
  const year = parseInt(yearStr, 10) || 2024;
  const month = parseInt(monthStr, 10) || 6;
  const day = parseInt(dayStr, 10) || 25;
  return new Date(year, month - 1, day);
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseYmdDate(dateStr);
  const dayName = INDONESIAN_DAYS_LONG[d.getDay()];
  const dayNum = d.getDate();
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}


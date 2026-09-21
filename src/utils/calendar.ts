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

  // 1-hour appointment window
  const endHour = (startHour + 1) % 24;
  const endDay = startHour + 1 >= 24 ? day + 1 : day;

  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
  const dtEnd = `${year}${pad(month)}${pad(endDay)}T${pad(endHour)}${pad(startMin)}00`;
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

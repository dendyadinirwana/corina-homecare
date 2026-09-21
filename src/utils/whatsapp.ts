import { formatIndonesianDate } from './calendar';

export interface WhatsAppBookingParams {
  patientName?: string;
  patientPhone?: string;
  serviceType?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  address?: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  complaint?: string;
  doctorPhone?: string;
}

export const DEFAULT_DOCTOR_WA_NUMBER = '6287772077213';

/**
 * Generates a structured WhatsApp text message template for confirmed patient bookings.
 */
export function generateWhatsAppBookingMessage(params: WhatsAppBookingParams): string {
  const serviceLabel =
    params.serviceType === 'teleconsultation'
      ? 'Telekonsultasi Video'
      : 'Kunjungan Dokter ke Rumah';

  const formattedDate = formatIndonesianDate(params.date || '2024-06-25');
  const timeLabel = params.time ? `${params.time} WIB` : '11:00 WIB';

  let message = `*RESERVASI KUNJUNGAN - DOKTER CORINA WULANDARI*\n\n`;
  message += `📋 *Data Pasien:*\n`;
  message += `• Nama Pasien: ${params.patientName?.trim() || '-'}\n`;
  message += `• No. WhatsApp: ${params.patientPhone?.trim() || '-'}\n`;
  message += `• Layanan: ${serviceLabel}\n\n`;

  message += `🗓 *Jadwal Kunjungan:*\n`;
  message += `• Hari/Tanggal: ${formattedDate}\n`;
  message += `• Jam Kunjungan: ${timeLabel}\n\n`;

  if (params.serviceType !== 'teleconsultation') {
    message += `📍 *Lokasi Kunjungan:*\n`;
    message += `• Alamat: ${params.address?.trim() || 'Tangerang Selatan'}\n`;
    if (params.landmark?.trim()) {
      message += `• Patokan: ${params.landmark.trim()}\n`;
    }
    if (params.coordinates?.lat && params.coordinates?.lng) {
      message += `• Google Maps: https://maps.google.com/?q=${params.coordinates.lat},${params.coordinates.lng}\n`;
    }
    message += `\n`;
  }

  message += `🩺 *Keluhan Utama:*\n`;
  message += `${params.complaint?.trim() || 'Pemeriksaan kesehatan rutin'}\n\n`;

  message += `---\n`;
  message += `Mohon konfirmasi ketersediaan jadwal Dokter. Terima kasih! 🙏`;

  return message;
}

/**
 * Creates the encoded wa.me URL with pre-filled message text.
 */
export function createWhatsAppBookingUrl(params: WhatsAppBookingParams): string {
  const doctorPhone = params.doctorPhone || DEFAULT_DOCTOR_WA_NUMBER;
  const message = generateWhatsAppBookingMessage(params);
  return `https://wa.me/${doctorPhone}?text=${encodeURIComponent(message)}`;
}

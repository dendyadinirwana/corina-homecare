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

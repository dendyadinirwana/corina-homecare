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

// /api/noninventory/bookings/route.js
import { db } from '../../../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
  }

  try {
    const [rows] = await db.query(`
      SELECT b.id, s.name AS service_name, p.name AS provider_name, b.booking_date, b.booking_time, b.status
      FROM non_inventory_bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN non_inventory_services s ON b.service_id = s.id
      WHERE b.user_id = ?
    `, [userId]);

    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

import { db } from '../../../../../lib/db';

export async function GET(request, { params }) {
  const { service } = params;

  try {
    const [rows] = await db.query(
      `
      SELECT id, name, bio, experience, phone, address, profile_pic, revenue, orders_count
      FROM providers
      WHERE service = ?
    `,
      [service]
    );

    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
}

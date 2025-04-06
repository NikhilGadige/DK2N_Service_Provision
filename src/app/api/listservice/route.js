import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT id, name 
      FROM non_inventory_services
    `);

    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
}

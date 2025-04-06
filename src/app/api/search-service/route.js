import { db } from '../../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing service query' }), { status: 400 });
    }

    const [results] = await db.query(
        `
        SELECT 
          p.name AS provider_name,
          p.bio,
          p.email,
          p.phone,
          p.address,
          p.profile_pic,
          s.name AS service_name,
          ps.price,
          ps.duration
        FROM 
          provider_non_inventory_services ps
        JOIN providers p ON ps.provider_id = p.id
        JOIN non_inventory_services s ON ps.service_id = s.id
        WHERE 
          s.name LIKE ?
        `,
        [`%${query}%`]
      );
      

    if (results.length === 0) {
      return new Response(JSON.stringify({ message: 'No service providers found' }), { status: 404 });
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

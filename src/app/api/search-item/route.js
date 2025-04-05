import { db } from '../../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing search query' }), { status: 400 });
    }

    const [results] = await db.query(
      `
      SELECT 
        s.shop_name, i.item_name, si.price, si.quantity_available
      FROM 
        shop_items si
      JOIN shops s ON si.shop_id = s.id
      JOIN items i ON si.item_id = i.id
      WHERE 
        i.item_name LIKE ?
      `,
      [`%${query}%`]
    );

    if (results.length === 0) {
      return new Response(JSON.stringify({ message: 'No items found' }), { status: 404 });
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

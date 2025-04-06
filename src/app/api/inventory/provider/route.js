import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get('provider_id');

  if (!providerId) {
    return NextResponse.json({ error: 'Missing provider_id' }, { status: 400 });
  }

  const query = `
    SELECT 
      s.id AS shop_id,
      s.shop_name,
      i.item_name,
      i.description,
      si.price,
      si.quantity_available
    FROM shop_items si
    JOIN shops s ON si.shop_id = s.id
    JOIN items i ON si.item_id = i.id
    WHERE s.provider_id = ?
  `;

  try {
    const [rows] = await db.execute(query, [providerId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

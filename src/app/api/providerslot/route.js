import { db } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider_id, service_id, date, start_time, end_time } = body;

    if (!provider_id || !service_id || !date || !start_time || !end_time) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for overlapping slots
    const [existingSlots] = await db.query(
      `SELECT * FROM provider_slots 
       WHERE provider_id = ? AND date = ? 
       AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?)
       )`,
      [provider_id, date, end_time, start_time, end_time, start_time]
    );

    if (existingSlots.length > 0) {
      return Response.json({ error: 'Slot overlaps with existing one' }, { status: 400 });
    }

    // Insert new slot
    await db.query(
      `INSERT INTO provider_slots (provider_id, service_id, date, start_time, end_time) 
       VALUES (?, ?, ?, ?, ?)`,
      [provider_id, service_id, date, start_time, end_time]
    );

    return Response.json({ success: true, message: 'Slot created successfully' });
  } catch (err) {
    console.error('Slot Creation Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

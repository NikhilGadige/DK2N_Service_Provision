import { db } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, provider_slot_id } = body;

    if (!user_id || !provider_slot_id) {
      return Response.json({ error: 'Missing user_id or provider_slot_id' }, { status: 400 });
    }

    // 1. Check slot availability
    const [slots] = await db.query(
      'SELECT * FROM provider_slots WHERE id = ? AND is_booked = false',
      [provider_slot_id]
    );

    if (!slots || slots.length === 0) {
      return Response.json({ error: 'Slot not available or already booked' }, { status: 400 });
    }

    const slot = slots[0];

    // 2. Insert booking
    await db.query(
      'INSERT INTO non_inventory_bookings (user_id, provider_slot_id) VALUES (?, ?)',
      [user_id, provider_slot_id]
    );

    // 3. Mark the slot as booked
    await db.query(
      'UPDATE provider_slots SET is_booked = true WHERE id = ?',
      [provider_slot_id]
    );

    // 4. Optional: Add notification
    await db.query(
      'INSERT INTO notifications (provider_id, message) VALUES (?, ?)',
      [slot.provider_id,` New booking on ${slot.date} at ${slot.start_time}`]
    );

    return Response.json({ success: true, message: 'Booking created successfully' });
  } catch (err) {
    console.error('Booking Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
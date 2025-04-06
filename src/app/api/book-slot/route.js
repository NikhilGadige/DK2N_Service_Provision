// src/app/api/book-slot/route.js
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db'; // Your mysql2 or any DB config using raw SQL

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, provider_id } = body;

    if (!user_id || !provider_id) {
      return NextResponse.json({ error: 'Missing user_id or provider_id' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO non_inventory_bookings (user_id, provider_id) VALUES (?, ?)',
      [user_id, provider_id]
    );

    return NextResponse.json({ message: 'Slot booked successfully', result }, { status: 201 });
  } catch (error) {
    console.error('Error booking slot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../../../lib/db';

export async function POST(req) {
  try {
    const { name, bio, email, password, experience, phone, address, needs_inventory, profile_pic } = await req.json();

    // Check if provider already exists
    const [existing] = await db.execute('SELECT * FROM providers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Provider already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new provider
    await db.execute(
      `INSERT INTO providers (name, bio, email, password, experience, phone, address, needs_inventory, profile_pic)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, bio, email, hashedPassword, experience, phone, address, needs_inventory, profile_pic]
    );

    return NextResponse.json({ message: 'Provider registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

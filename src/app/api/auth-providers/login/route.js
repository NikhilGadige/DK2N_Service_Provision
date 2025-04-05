import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../../../lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const [rows] = await db.execute('SELECT * FROM providers WHERE email = ?', [email]);
    const provider = rows[0];

    if (!provider) {
      return NextResponse.json({ message: 'Provider not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Remove password before sending back
    delete provider.password;

    return NextResponse.json({ message: 'Login successful', provider }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

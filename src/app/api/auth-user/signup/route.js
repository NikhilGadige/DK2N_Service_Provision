// src/app/api/auth/signup/route.js
import { db } from '../../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, profile_pic, address } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, profile_pic, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, profile_pic, address]
    );

    return new Response(JSON.stringify({ message: 'Signup successful' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

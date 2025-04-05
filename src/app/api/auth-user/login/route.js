// src/app/api/auth/login/route.js
import { db } from '../../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const [userResult] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userResult.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = userResult[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Optional: Add JWT here
    return new Response(JSON.stringify({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        address: user.address,
        created_at: user.created_at
      }
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

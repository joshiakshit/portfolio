// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'username and password required' }, { status: 400 });
  }

  const result = await pool.query('SELECT id, password_hash FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  if (!user) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await pool.query(
    'INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id',
    [user.id, expiresAt]
  );
  const sessionId = session.rows[0].id;

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return res;
}
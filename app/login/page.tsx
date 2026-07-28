// app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    setError('invalid credentials');
    return;
  }

  router.push('/');
}

  return (
    <main>
      <div className="login-header">
        <Link href="/" className="back">← back</Link>
        <h1>login</h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">invalid credentials</p>}
        <button type="submit">log in</button>
      </form>
    </main>
  );
}
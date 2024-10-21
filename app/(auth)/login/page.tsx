"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js client-side navigation
import { logInWithEmail } from '@/utils/firebaseAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();  // Initialize router for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await logInWithEmail(email, password);

      if (user?.emailVerified) {
        // If the email is verified, navigate to the authenticated main page
        router.push('/');
      } else {
        setError('Please verify your email before logging in.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error logging in: ' + err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

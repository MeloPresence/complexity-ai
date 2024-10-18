"use client"
import { useState } from 'react';
import { logInWithEmail } from '@/utils/firebaseAuth';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logInWithEmail(email, password);
      alert('Login successful!');
    } catch (err: unknown) {
        // Type assertion for err as Error
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

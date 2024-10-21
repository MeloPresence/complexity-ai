"use client"
import { useState } from 'react';
//import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { signUpWithEmail } from '@/utils/firebaseAuth';
import Link from "next/link"

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  //const router = useRouter();  // For navigation

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const user = await signUpWithEmail(email, password);
      setSuccessMessage('Sign-up successful! A verification email has been sent to your email address.');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error signing up: ' + err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>

      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}

      <p>
        Already have an account?{' '}
        <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;

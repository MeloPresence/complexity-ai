"use client";

import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card-login";
import { Input } from "@/registry/new-york/ui/input";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email has been sent! Please check your inbox.');
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error sending reset email: ' + err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSuccessMessage(''); // Clear the success message if there's an error
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Reset Password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2 text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full bg-black text-white rounded-md py-2" onClick={handlePasswordReset}>
            Send Reset Link
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logInWithEmail } from "@/utils/firebaseAuth";
import Link from "next/link";
import { z } from "zod";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email field cannot be left blank" })
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, { message: "Password field cannot be left blank" })
      // .min(5, { message: "Password must be at least 5 characters long" })
      // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      // .regex(/\d/, { message: "Password must contain at least one number" })
      // .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Validate the form data
    try {
      // First, check if the email and password are empty
      if (email.trim() === "") {
        setError("Email field cannot be left blank");
        return;
      }

      if (password.trim() === "") {
        setError("Password field cannot be left blank");
        return;
      }

      // Validate email and password against the schema
      loginSchema.parse({ email, password });

      // Attempt to log in with email and password
      const user = await logInWithEmail(email, password); // Ensure you have this function implemented

      if (user?.emailVerified) {
        router.push("/");
      } else {
        setError("Please verify your email before logging in.");
      }
    } catch (err: unknown) {

      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map((error) => error.message).join(", ");
        setError(validationErrors);
        return;
      }

      // Handle authentication errors (like incorrect password)
      if (err instanceof Error) {
        if (err.message.includes("wrong-password")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Error logging in: " + err.message);
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold tracking-tight">Login</CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">Enter your email and password to login</CardDescription>
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
          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2 text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full bg-black text-white rounded-md py-2" onClick={handleLogin}>
            Login
          </Button>
          <Link href="/forget-password" className="text-sm text-muted-foreground">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

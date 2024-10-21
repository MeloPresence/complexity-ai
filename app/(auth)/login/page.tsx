"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logInWithEmail } from "@/utils/firebaseAuth";
import Link from "next/link";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await logInWithEmail(email, password);

      if (user?.emailVerified) {
        router.push("/");
      } else {
        setError("Please verify your email before logging in.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error logging in: " + err.message);
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

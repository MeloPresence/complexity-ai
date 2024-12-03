"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInWithEmailAndPassword } from "@/lib/client/firebase/auth"
import { EmailUnverifiedError } from "@/lib/errors"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email field cannot be left blank" })
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, { message: "Password field cannot be left blank" }),
    // .min(5, { message: "Password must be at least 5 characters long" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    // .regex(/\d/, { message: "Password must contain at least one number" })
    // .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Reset error state

    // Validate the form data
    try {
      // First, check if the email and password are empty
      if (email.trim() === "") {
        setError("Email field cannot be left blank")
        return
      }

      if (password.trim() === "") {
        setError("Password field cannot be left blank")
        return
      }

      // Validate email and password against the schema
      loginSchema.parse({ email, password })

      const user = await signInWithEmailAndPassword(email, password)

      if (user.emailVerified) {
        router.push("/")
      } else {
        throw new EmailUnverifiedError()
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors
          .map((error) => error.message)
          .join(", ")
        setError(validationErrors)
        return
      }

      // Handle authentication errors (like incorrect password)
      if (err instanceof Error && err.message.includes("wrong-password")) {
        setError("Incorrect password. Please try again.")
        return
      }
      if (err instanceof Error) {
        setError("Error logging in: " + err.message)
        return
      }

      setError("An unknown error occurred.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-800">
      <Card className="w-full max-w-md p-8 dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="font-sans text-3xl text-center font-semibold tracking-tight">
            Login
          </CardTitle>
          <CardTitle className="font-sans text-xl font-semibold tracking-tight pt-6">
            Welcome back!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground dark:text-white">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2 text-sm dark:bg-neutral-700"
            />
          </div>
          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2 text-sm dark:bg-neutral-700"
            />
          <Link
            href="/forget-password"
            className="text-xs text-muted-foreground ml-auto dark:text-white"
          >
            Forgot password?
          </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="mt-2 w-full bg-black text-white font-bold rounded-md dark:bg-zinc-200 dark:text-black"
            onClick={handleLogin}
          >
            Login
          </Button>

          <div className="mt-2 text-sm text-muted-foreground dark:text-white">
            Don't have an account yet?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Register now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

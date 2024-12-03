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
import { sendPasswordResetEmail } from "@/lib/client/firebase/auth"
import { useState } from "react"
import { z } from "zod"

// Zod schema for email validation
const forgotPassSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field cannot be left blank" })
    .email({ message: "Invalid email address" }),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("") // Clear previous errors
    setSuccessMessage("") // Clear previous success message

    // Zod validation
    try {
      // First, validate the email format using Zod
      forgotPassSchema.parse({ email })

      await sendPasswordResetEmail(email)

      // If no error is thrown, email is sent successfully
      setSuccessMessage(
        "Password reset email has been sent! Please check your inbox.",
      )
    } catch (err) {
      // Zod validation errors
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map((e) => e.message).join(", ")
        setErrorMessage(validationErrors)
        return
      }

      // Firebase-specific errors
      if (err instanceof Error && err.message.includes("auth/user-not-found")) {
        setErrorMessage(
          "This email is not linked to any account. Please use a registered email or create a new one.",
        )
        return
      }

      if (err instanceof Error) {
        setErrorMessage("Error sending reset email: " + err.message)
        return
      }

      // ???
      setErrorMessage("An unknown error occurred.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-800">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
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
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full bg-black text-white font-bold rounded-md py-2 dark:bg-zinc-200 dark:text-black"
            onClick={handlePasswordReset}
          >
            Send Reset Link
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

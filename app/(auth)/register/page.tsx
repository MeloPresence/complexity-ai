"use client";
import { useState } from "react";
import Link from "next/link";
import { signUpWithEmail } from "@/utils/firebaseAuth";
import { z } from "zod";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const signUpSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email field cannot be left blank" })
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, { message: "Password field cannot be left blank" })
      .min(5, { message: "Password must be at least 5 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate the form data
    try {
      // First, check if the email is empty
      if (email.trim() === "") {
        setError("Email field cannot be left blank");
        return;
      }

      else if (password.trim() === "") {
        setError("Password field cannot be left blank");
        return;
      }

      // Then validate the entire schema
      signUpSchema.parse({ email, password }); // Validate email and password with Zod

      // If validation passes, proceed with sign-up
      const user = await signUpWithEmail(email, password);
      setSuccessMessage(
        "Sign-up successful! A verification email has been sent to your email address."
      );
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(error => error.message).join(", ");
        setError(validationErrors);
        return;
      }

      // Handle other errors (like sign-up errors)
      if (err instanceof Error) {
        setError("Error signing up: " + err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="container relative hidden h-[750px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden w-[60vw] h-full flex-col bg-cover bg-center bg-no-repeat p-10 text-white dark:border-r lg:flex"
       style={{ backgroundImage: "url('https://images.hdqwalls.com/download/digital-art-abstract-black-lines-minimalism-5k-q3-3840x2160.jpg')" }}>
    <div className="absolute inset-0 bg-opacity-70" /> {/* Optional: for overlay effect */}

    <div className="relative z-20 flex items-center text-lg font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-6 w-6"
      >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Complexity Ai
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Unlock the future of AI with Complexity Ai—your go-to platform for seamless document extraction,
              image analysis, and code generation tailored to your needs.&rdquo;
            </p>
            <footer className="text-sm">by Eljrick & Farah</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative mr-150 lg:p-8 flex justify-center items-center ml-[10vw]">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to create your account.
            </p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-black text-white rounded-md py-2"
            >
              Sign Up
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

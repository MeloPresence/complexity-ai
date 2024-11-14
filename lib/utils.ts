import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const FIREBASE_AUTH_TOKEN_COOKIE = "cAI.firebaseAuthToken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

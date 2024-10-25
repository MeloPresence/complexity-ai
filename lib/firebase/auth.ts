import { auth } from "@/lib/firebase/app"
import {
  createUserWithEmailAndPassword,
  NextOrObserver,
  onAuthStateChanged as onAuthStateChangedFn,
  sendEmailVerification,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFn,
  Unsubscribe,
  User,
} from "firebase/auth"

export function onAuthStateChanged(
  callback: NextOrObserver<User>,
): Unsubscribe {
  return onAuthStateChangedFn(auth, callback)
}

export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(user)
  return user
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
): Promise<User> {
  const { user } = await signInWithEmailAndPasswordFn(auth, email, password)
  return user
}

export async function signOut(): Promise<void> {
  return auth.signOut()
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  return sendPasswordResetEmailFn(auth, email)
}

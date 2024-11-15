"use client" // Firebase does client-side authentication!

import { auth } from "@/lib/client/firebase/app"
import { onAuthStateChanged } from "@/lib/client/firebase/auth"
import { type User } from "firebase/auth"
import { createContext, useEffect, useState } from "react"

export const IsAuthenticatedContext = createContext<boolean>(false)

export const FirebaseUserContext = createContext<User | null>(null)

/**
 * React hook to use a stateful Firebase user value.
 *
 * If `null` is returned, the user is not logged in
 * If a `User` is returned and not `User.isAnonymous`, the user is authenticated
 */
export function useFirebaseUserState(): User | null {
  const [user, setUser] = useState<User | null>(auth.currentUser)

  useEffect(() => {
    // Return the unsubscribe function for cleanup
    return onAuthStateChanged((authUser: User | null) => {
      setUser(authUser)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return user
}

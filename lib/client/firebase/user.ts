"use client" // Firebase does client-side authentication!

import { auth } from "@/lib/client/firebase/app"
import { onAuthStateChanged } from "@/lib/client/firebase/auth"
import { type User } from "firebase/auth"
import { createContext, useEffect, useState } from "react"

export const IsLoadingContext = createContext<boolean>(true)

export const IsAuthenticatedContext = createContext<boolean>(false)

/**
 * React hook to use a stateful Firebase user value.
 *
 * If `null` is returned, the user is not logged in
 * If a `User` is returned and not `User.isAnonymous`, the user is authenticated
 */
export function useFirebaseUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(
    auth.currentUser || undefined,
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      console.debug("onAuthStateChanged", authUser)
      setUser(authUser)
    })

    return () => unsubscribe() // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return user
}

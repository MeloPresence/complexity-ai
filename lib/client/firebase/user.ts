"use client" // Firebase does client-side authentication!

import { onAuthStateChanged } from "@/lib/client/firebase/auth"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"

/**
 * React hook to use a stateful Firebase user value.
 *
 * If `undefined` is returned, useEffects depending on this value must abort to avoid "too many re-renders"
 * If `null` is returned, the user is not logged in
 * If a `User` is returned and not `User.isAnonymous`, the user is authenticated
 */
export function useFirebaseUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      console.debug("onAuthStateChanged", { authUser })
      setUser(authUser)
    })

    return () => unsubscribe() // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return user
}

export function useIsAuthenticated() {
  const user: User | null | undefined = useFirebaseUser()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    if (user === undefined) return
    setIsAuthenticated(Boolean(user && !user.isAnonymous && user.emailVerified))
  }, [user])

  return isAuthenticated
}

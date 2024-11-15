"use client"

import {
  FirebaseUserContext,
  IsAuthenticatedContext,
  useFirebaseUserState,
} from "@/lib/client/firebase/user"
import { addCookie } from "@/lib/client/utils"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import type { User } from "firebase/auth"
import * as React from "react"
import { useEffect, useState } from "react"

async function addIdTokenCookie(user: User) {
  const token = await user.getIdToken()
  addCookie(FIREBASE_AUTH_TOKEN_COOKIE, token)
}

export default function ClientPagesLayout({
  isAuthenticated: isAuthenticatedFromServer = false,
  children,
}: Readonly<{
  isAuthenticated?: boolean
  children: React.ReactNode
}>) {
  const user = useFirebaseUserState()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isAuthenticatedFromServer,
  )

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      addIdTokenCookie(user)
    }
  }, [user])

  return (
    <IsAuthenticatedContext.Provider value={isAuthenticated}>
      <FirebaseUserContext.Provider value={user}>
        {children}
      </FirebaseUserContext.Provider>
    </IsAuthenticatedContext.Provider>
  )
}

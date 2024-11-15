"use client"

import {
  IsAuthenticatedContext,
  useFirebaseUserState,
} from "@/lib/client/firebase/user"
import { addCookie } from "@/lib/client/utils"
import { type UserInfo, UserInfoContext } from "@/lib/user"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import type { User } from "firebase/auth"
import * as React from "react"
import { useEffect, useState } from "react"

async function addIdTokenCookie(user: User) {
  const token = await user.getIdToken()
  addCookie(FIREBASE_AUTH_TOKEN_COOKIE, token)
}

export default function AuthenticationProvider({
  isAuthenticated: isAuthenticatedFromServer = false,
  userInfo: userInfoFromServer = null,
  children,
}: Readonly<{
  isAuthenticated?: boolean
  userInfo?: UserInfo | null
  children: React.ReactNode
}>) {
  const user = useFirebaseUserState()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    user || userInfoFromServer,
  )

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isAuthenticatedFromServer,
  )

  useEffect(() => {
    if (user && user.emailVerified) {
      setIsAuthenticated(true)
      setUserInfo(user)
      addIdTokenCookie(user)
    }
    // Assume can't become unauthenticated midway for now
  }, [user])

  return (
    <IsAuthenticatedContext.Provider value={isAuthenticated}>
      <UserInfoContext.Provider value={userInfo}>
        {children}
      </UserInfoContext.Provider>
    </IsAuthenticatedContext.Provider>
  )
}

"use client" // Firebase does client-side authentication!

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  FirebaseUserContext,
  IsAuthenticatedContext,
  IsLoadingContext,
  useFirebaseUser,
} from "@/lib/client/firebase/user"
import { addCookie } from "@/lib/client/utils"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import type { User } from "firebase/auth"
import * as React from "react"
import { useContext, useEffect, useState } from "react"

async function addIdTokenCookie(user: User) {
  const token = await user.getIdToken()
  addCookie(FIREBASE_AUTH_TOKEN_COOKIE, token)
}

function MaybeSidebar({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useContext(IsAuthenticatedContext)
  if (isAuthenticated) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    )
  } else {
    return <div>{children}</div>
  }
}

export function ChatLayout({
  isAuthenticated: isAuthenticatedFromServer = false,
  children,
}: {
  isAuthenticated?: boolean
  children: React.ReactNode
}) {
  const user = useFirebaseUser()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isAuthenticatedFromServer,
  )

  useEffect(() => {
    console.debug("components/chat-layout.tsx/useEffect [user]", { user })
    setIsLoading(false)
    if (user) {
      setIsAuthenticated(true)
      addIdTokenCookie(user)
    }
  }, [user])

  return (
    <IsLoadingContext.Provider value={isLoading}>
      <IsAuthenticatedContext.Provider value={isAuthenticated}>
        <FirebaseUserContext.Provider value={user}>
          <MaybeSidebar>
            <Header />
            <main className="flex items-center justify-center min-h-screen">
              {children}
            </main>
          </MaybeSidebar>
        </FirebaseUserContext.Provider>
      </IsAuthenticatedContext.Provider>
    </IsLoadingContext.Provider>
  )
}

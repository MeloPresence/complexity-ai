"use client" // Firebase does client-side authentication!

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  IsAuthenticatedContext,
  IsLoadingContext,
  useFirebaseUser,
} from "@/lib/client/firebase/user"
import { getFirebaseAuthKey } from "@/lib/utils"
import * as React from "react"
import { useContext, useEffect, useState } from "react"

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useFirebaseUser()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  console.time("loading")
  useEffect(() => {
    if (user === undefined) return
    console.timeEnd("loading")
    console.debug("(chat)/layout.tsx useEffect", { user })
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    getFirebaseAuthKey()
      .then((value) => {
        console.timeEnd("loading")
        console.debug("getFirebaseAuthKey", value)
        setIsLoading(false)
        setIsAuthenticated(Boolean((value as unknown[]).length))
      })
      .catch(() => {
        console.timeEnd("loading")
        console.debug("getFirebaseAuthKey", undefined)
        setIsLoading(false)
        setIsAuthenticated(false)
      })
  })

  return (
    <IsLoadingContext.Provider value={isLoading}>
      <IsAuthenticatedContext.Provider value={isAuthenticated}>
        <MaybeSidebar>
          <Header />
          <main className="flex items-center justify-center min-h-screen">
            {children}
          </main>
        </MaybeSidebar>
      </IsAuthenticatedContext.Provider>
    </IsLoadingContext.Provider>
  )
}

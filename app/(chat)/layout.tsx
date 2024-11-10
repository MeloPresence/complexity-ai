"use client" // Firebase does client-side authentication!

import { AppSidebar } from "@/components/app-sidebar"
import { DebugUserInfo } from "@/components/debug-user"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useFirebaseUser, useIsAuthenticated } from "@/lib/client/firebase/user"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const user: User | null | undefined = useFirebaseUser()
  const isAuthenticated = useIsAuthenticated()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    console.debug("(chat)/layout.tsx useEffect", { user })
    if (user === undefined) return
    setIsLoading(false)
  }, [user])

  let page

  if (isAuthenticated) {
    page = (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-grow flex flex-col items-center justify-center p-6 w-full">
          <SidebarTrigger className="absolute top-4 left-1" />
          <DebugUserInfo />
          {children}
        </main>
      </SidebarProvider>
    )
  } else {
    page = <div>{children}</div>
  }

  return isLoading ? <div>Loading</div> : page
}

"use client" // Firebase does client-side authentication!

import { useFirebaseUser } from "@/lib/firebase/user"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export default function Layout({
  anonymous,
  authenticated,
}: {
  anonymous: React.ReactNode
  authenticated: React.ReactNode
})
{
  const user: User | null | undefined = useFirebaseUser()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    console.debug("(chat)/layout.tsx useEffect", { user })
    if (user === undefined) return
    setIsAuthenticated(Boolean(user && !user.isAnonymous && user.emailVerified))
    setIsLoading(false)
  }, [user])

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-grow flex items-center justify-center p-6 w-full">
              <SidebarTrigger className="absolute top-4 left-1" />
              {isAuthenticated ? authenticated : anonymous}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

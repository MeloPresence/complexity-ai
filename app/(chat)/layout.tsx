"use client" // Firebase does client-side authentication!

import { useFirebaseUser } from "@/lib/firebase/user"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Building Your Application
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
                  {/* Content for authenticated or anonymous user */}
                  <main className="flex items-center justify-center min-h-screen">
                    {isAuthenticated ? authenticated : anonymous}
                  </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

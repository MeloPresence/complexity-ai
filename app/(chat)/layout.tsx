"use client" // Firebase does client-side authentication!

import { useFirebaseUser } from "@/lib/firebase/user"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"

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

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const { setTheme } = useTheme()

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
              <header className="dark:bg-neutral-800 flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                <div className="ml-auto flex">
                <Link href="/register">
                <button className="dark:text-white dark:hover:bg-neutral-600 font-semibold font-sans ml-auto flex bg-transparent text-black text-base px-4 py-2 hover:bg-accent rounded-md">
                  Sign Up
                  </button>
                  </Link>
                </div>

                <div className="flex justify-end items-center p-4 bg-gray-100 bg-transparent dark:bg-neutral-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

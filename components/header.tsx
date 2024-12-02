"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IsAuthenticatedContext } from "@/lib/client/firebase/user"
import { UserInfoContext } from "@/lib/user"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import * as React from "react"
import { useContext } from "react"

export function Header() {
  const { setTheme } = useTheme()
  const isAuthenticated = useContext(IsAuthenticatedContext)
  const userInfo = useContext(UserInfoContext)

  return (
    <header className="dark:bg-neutral-800 flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        {isAuthenticated && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        {/* <Breadcrumb>
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
        </Breadcrumb> */}
      </div>
      <div className="ml-auto flex">
        {!userInfo && (
          <Link href="/login">
            <button className="dark:text-white dark:hover:bg-neutral-600 font-semibold font-sans ml-auto flex bg-transparent text-black text-base px-4 py-2 hover:bg-accent rounded-md">
              Log In
            </button>
          </Link>
        )}
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
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => setTheme("system")}
              >
                System
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

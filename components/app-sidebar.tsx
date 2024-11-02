import { Calendar, Home, Inbox, Search, Settings, ChevronUp, User2, MoreHorizontal, CircleUser } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"

// Main menu items.
const items = [
  {
    title: "Today",
    url: "#",
  },
  {
    title: "Yesterday",
    url: "#",
  },
  {
    title: "Previous 30 days",
    url: "#",
  },
  {
    title: "September",
    url: "#",
  },
]

// Submenu items.
const subItems = [
  {
    title: "Dolphin rate in 2023",
    url: "#"
  },
  {
    title: "The Secret of NIMH video",
    url: "#"
  }
]

export function AppSidebar() {

  const { setTheme } = useTheme()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <SidebarGroupLabel className="truncate font-semibold text-lg">Complexity Ai</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="py-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                            <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" className="bg-white border border-gray-200 rounded-md shadow-lg p-2 min-w-[150px] z-50">
                            <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                <span>Log out</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
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
          </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "@/lib/client/firebase/auth"
import { FirebaseUserContext } from "@/lib/client/firebase/user"

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from "react"

export function NavUser() {
  const router = useRouter()
  const user = useContext(FirebaseUserContext)
  const { isMobile } = useSidebar()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user.uid}`}
                      alt={user.displayName || user.email || user.uid}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.displayName || "No name"}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </>
              ) : (
                <>Loading</>
              )}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user && (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user.uid}`}
                        alt={user.displayName || user.email || user.uid}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.displayName || "No name"}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <button className="flex items-center w-full p-1">
                  <BadgeCheck className="mr-2" />
                  Account
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuItem asChild>
              <Link href="/login">
                <button
                  className="flex items-center w-full p-1"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2" />
                  Log out
                </button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

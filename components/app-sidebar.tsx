import { getConversationList } from "@/actions/conversations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { signOut } from "@/lib/client/firebase/auth"
import { User } from "firebase/auth"
import { ChevronUp, MoreHorizontal, User2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Main menu items.
const items = [
  {
    title: "Today",
    url: "#",
  },
  // {
  //   title: "Yesterday",
  //   url: "#",
  // },
  // {
  //   title: "Previous 30 days",
  //   url: "#",
  // },
  // {
  //   title: "September",
  //   url: "#",
  // },
]

export function AppSidebar({ user }: { user: User | null | undefined }) {
  const router = useRouter()
  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }
  const [conversations, setConversations] = useState<any[]>([])
  useEffect(() => {
    if (user)
      // TODO: Get conversation list again when updates happen in chat
      getConversationList(user.uid).then((result) => setConversations(result))
  }, [user])

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
            <SidebarGroupLabel className="truncate font-semibold text-black text-lg">
              Complexity AI
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="py-4">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">New chat</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {conversations.map((conversation) => (
                      <SidebarMenuSubItem key={conversation.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/${conversation.id}`}>
                            {conversation.name}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuAction>
                                  <MoreHorizontal />
                                </SidebarMenuAction>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="right"
                                align="start"
                                className="bg-white border border-gray-200 rounded-md shadow-lg p-2 min-w-[150px] z-50"
                              >
                                <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                                  <span>Rename</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </Link>
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
                  <User2 /> {user?.displayName || user?.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator /> */}
                <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                  <span>Dark mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                  <button onClick={handleSignOut}>Log out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

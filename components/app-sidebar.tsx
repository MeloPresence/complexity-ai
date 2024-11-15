"use client"

import { getConversationList } from "@/actions/conversations"
import { NavConversations } from "@/components/nav-conversations"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  FirebaseUserContext,
  IsAuthenticatedContext,
} from "@/lib/client/firebase/user"
import type { ConversationInfo } from "@/lib/conversation"
import { Command } from "lucide-react"
import * as React from "react"
import { useContext, useEffect, useState } from "react"

// This is sample data.
const data = {
  apps: {
    name: "Complexity AI",
    logo: Command,
  },
}

export function AppSidebar() {
  const user = useContext(FirebaseUserContext)
  const [conversations, setConversations] = useState<
    (ConversationInfo & { url: string })[]
  >([])
  useEffect(() => {
    if (user)
      // TODO: Get conversation list again when updates happen in chat
      getConversationList(user.uid).then((result) =>
        setConversations(
          result.map((item) => {
            return { ...item, url: `/${item.id}` }
          }),
        ),
      )
  }, [user])
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 ml-3 mt-3">
          <data.apps.logo />
          <span className="font-sans font-semibold">{data.apps.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavConversations
          today={conversations}
          yesterday={[]}
          previous30days={[]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function SidebarIfAuthenticated({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

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
import { ConversationInfoListContext } from "@/lib/client/utils"
import {
  categorizeConversationsByTime,
  type CategorizedConversationInfo,
  type ConversationInfo,
} from "@/lib/conversation"
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
  const conversations = useContext(ConversationInfoListContext)
  const categorizedConversations: CategorizedConversationInfo =
    categorizeConversationsByTime(conversations)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 ml-1 mt-3">
          <data.apps.logo />
          <span className="font-sans font-semibold">{data.apps.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavConversations items={categorizedConversations} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function SidebarIfAuthenticated({
  conversations: conversationsFromServer = [],
  children,
}: Readonly<{
  conversations?: ConversationInfo[]
  children: React.ReactNode
}>) {
  const isAuthenticated = useContext(IsAuthenticatedContext)
  let inner
  if (isAuthenticated) {
    inner = (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    )
  } else {
    inner = <div>{children}</div>
  }

  const [conversations, setConversations] = useState<ConversationInfo[]>(
    conversationsFromServer,
  )

  const user = useContext(FirebaseUserContext)
  useEffect(() => {
    if (user)
      // TODO: Get conversation list again when updates happen in chat (probably can change the context value type)
      getConversationList(user.uid).then((result) => setConversations(result))
  }, [user])

  return (
    <ConversationInfoListContext.Provider value={conversations}>
      {inner}
    </ConversationInfoListContext.Provider>
  )
}

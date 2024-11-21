"use client"

import { getConversationList } from "@/actions/conversations"
import { NavConversations } from "@/components/nav-conversations"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IsAuthenticatedContext } from "@/lib/client/firebase/user"
import { ConversationInfoListContext } from "@/lib/client/utils"
import {
  categorizeConversationsByTime,
  type CategorizedConversationInfo,
  type ConversationInfo,
} from "@/lib/conversation"
import { UserInfoContext } from "@/lib/user"
import { Command, LayoutDashboard } from "lucide-react"
import * as React from "react"
import { useContext, useEffect, useRef, useState } from "react"

const DASHBOARD_PORT = 3000
const DASHBOARD_PATH = "/d/complexity-ai/complexity-ai"

const data = {
  apps: {
    name: "Complexity AI",
    logo: Command,
  },
}

export function AppSidebar() {
  const userInfo = useContext(UserInfoContext)
  const conversations = useContext(ConversationInfoListContext)
  const categorizedConversations: CategorizedConversationInfo =
    categorizeConversationsByTime(conversations)

  const dashboardLink = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (dashboardLink.current) {
      dashboardLink.current.href =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        DASHBOARD_PORT +
        DASHBOARD_PATH
    }
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 ml-3 mt-3">
          <data.apps.logo />
          <span className="font-sans font-semibold">{data.apps.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavConversations items={categorizedConversations} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button asChild className="w-full justify-start">
              <a ref={dashboardLink} href={DASHBOARD_PATH} target="_blank">
                <LayoutDashboard />
                Dashboard
              </a>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        {userInfo && <NavUser {...{ userInfo }} />}
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

  const userInfo = useContext(UserInfoContext)
  const isFirstFetchDone = useRef(false)
  useEffect(() => {
    if (userInfo && !isFirstFetchDone.current) {
      // TODO: Get conversation list again when updates happen in chat (probably can change the context value type)
      getConversationList(userInfo.uid).then((result) =>
        setConversations(result),
      )
      isFirstFetchDone.current = true
    }
  }, [userInfo])

  return (
    <ConversationInfoListContext.Provider value={conversations}>
      {inner}
    </ConversationInfoListContext.Provider>
  )
}

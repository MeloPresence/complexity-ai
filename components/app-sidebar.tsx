"use client"

import { getConversationList } from "@/actions/conversations"
//import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
//import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useFirebaseUser } from "@/lib/client/firebase/user"
import { Command } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"

// This is sample data.
const data = {
  apps: {
    name: "Complexity AI",
    logo: Command,
  },
}

export function AppSidebar() {
  const user = useFirebaseUser()
  const [conversations, setConversations] = useState<any[]>([])
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
          {/* Renders the app logo icon */}
          <span className="font-sans font-semibold">{data.apps.name}</span>{" "}
          {/* Renders the app name */}
        </div>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects today={conversations} yesterday={[]} previous30days={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

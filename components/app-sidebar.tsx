"use client"

import * as React from "react"
import { Command } from "lucide-react"

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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  apps: {
    name: "Complexity Ai",
    logo: Command,
  },
  today: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
  yesterday: [
    {
      name: "Team Meeting",
      url: "#",
    },
    {
      name: "Client Review",
      url: "#",
    },
  ],
  previous30days: [
    {
      name: "Project Planning",
      url: "#",
    },
    {
      name: "Developnent Spring",
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects
          today={data.today}
          yesterday={data.yesterday}
          previous30days={data.previous30days}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

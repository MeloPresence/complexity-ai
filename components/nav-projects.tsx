"use client"

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  today,
  yesterday,
  previous30days,
}: {
  today: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  yesterday: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  previous30days: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  // Helper function to render a list of projects
  const renderProjects = (projects: { name: string; url: string; icon: LucideIcon }[]) => (
    <SidebarMenu>
      {projects.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <a href={item.url}>
              <item.icon />
              <span>{item.name}</span>
            </a>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem>
                <Pencil className="text-muted-foreground" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  return (
    <>
      {today && today.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Today</SidebarGroupLabel>
          {renderProjects(today)}
        </SidebarGroup>
      )}
      {yesterday && yesterday.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
          {renderProjects(yesterday)}
        </SidebarGroup>
      )}
      {previous30days && previous30days.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Previous 30 Days</SidebarGroupLabel>
          {renderProjects(previous30days)}
        </SidebarGroup>
      )}
    </>
  )
}

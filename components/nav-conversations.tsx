"use client"

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
import type {
  CategorizedConversationInfo,
  ConversationInfoWithUrl,
} from "@/lib/conversation"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export function NavConversations({
  items,
}: {
  items: CategorizedConversationInfo
}) {
  const { isMobile } = useSidebar()

  // Helper function to render a list of projects
  const renderConversations = (conversations: ConversationInfoWithUrl[]) => (
    <SidebarMenu>
      {conversations.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild>
            <Link href={item.url}>
              <span>{item.name}</span>
            </Link>
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
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">New chat</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      {items.today.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Today</SidebarGroupLabel>
          {renderConversations(items.today)}
        </SidebarGroup>
      )}
      {items.yesterday.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
          {renderConversations(items.yesterday)}
        </SidebarGroup>
      )}
      {items.previous30days.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Previous 30 Days</SidebarGroupLabel>
          {renderConversations(items.previous30days)}
        </SidebarGroup>
      )}
      {items.older.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Older</SidebarGroupLabel>
          {renderConversations(items.older)}
        </SidebarGroup>
      )}
    </>
  )
}

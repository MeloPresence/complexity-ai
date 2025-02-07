import { getConversationList } from "@/actions/conversations"
import { SidebarIfAuthenticated } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import type { ConversationInfo } from "@/lib/conversation"
import { verifyIdTokenFromCookies } from "@/lib/server/firebase/auth"
import * as React from "react"

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  /**
   * https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
   * Passing data between a parent layout and its children is not possible.
   * Workaround: caching, see https://github.com/vercel/next.js/discussions/52267
   */

  let conversations: ConversationInfo[] = []

  const result = await verifyIdTokenFromCookies()
  if (result?.decoded)
    conversations = await getConversationList(result.decoded.uid)

  return (
    <SidebarIfAuthenticated {...{ conversations }}>
      <Header />
      <main className="flex items-center justify-center min-h-screen">
        {children}
      </main>
    </SidebarIfAuthenticated>
  )
}

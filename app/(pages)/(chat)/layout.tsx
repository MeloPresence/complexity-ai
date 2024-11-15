import { getConversationList } from "@/actions/conversations"
import { SidebarIfAuthenticated } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import type { ConversationInfo } from "@/lib/conversation"
import { verifyIdToken } from "@/lib/server/firebase/auth"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import { cookies } from "next/headers"
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
  const cookieJar = cookies()
  const firebaseAuthToken =
    cookieJar.get(FIREBASE_AUTH_TOKEN_COOKIE)?.value || null

  let conversations: ConversationInfo[] = []

  if (firebaseAuthToken) {
    const result = await verifyIdToken(firebaseAuthToken)
    if (result.decoded)
      conversations = await getConversationList(result.decoded.uid)
  }

  return (
    <SidebarIfAuthenticated {...{ conversations }}>
      <Header />
      <main className="flex items-center justify-center min-h-screen">
        {children}
      </main>
    </SidebarIfAuthenticated>
  )
}

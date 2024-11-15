import { SidebarIfAuthenticated } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import * as React from "react"

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarIfAuthenticated>
      <Header />
      <main className="flex items-center justify-center min-h-screen">
        {children}
      </main>
    </SidebarIfAuthenticated>
  )
}

import AuthenticationProvider from "@/components/auth-provider"
import { verifyIdTokenFromCookies } from "@/lib/server/firebase/auth"
import type { UserInfo } from "@/lib/user"

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let isAuthenticated = false

  const result = await verifyIdTokenFromCookies()
  if (result?.decoded?.email_verified) isAuthenticated = true

  const { email, uid } = result?.decoded || {}
  const userInfo = result?.decoded ? ({ email, uid } as UserInfo) : null

  return (
    <AuthenticationProvider {...{ isAuthenticated, userInfo }}>
      {children}
    </AuthenticationProvider>
  )
}

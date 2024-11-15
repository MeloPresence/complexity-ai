import AuthenticationProvider from "@/components/auth-provider"
import { verifyIdToken } from "@/lib/server/firebase/auth"
import type { UserInfo } from "@/lib/user"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import { cookies } from "next/headers"

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieJar = cookies()
  const firebaseAuthToken =
    cookieJar.get(FIREBASE_AUTH_TOKEN_COOKIE)?.value || null

  let isAuthenticated = false

  let result = null

  if (firebaseAuthToken) {
    result = await verifyIdToken(firebaseAuthToken)
    if (result.decoded?.email_verified) {
      isAuthenticated = true
      console.debug(`Verified auth token for user ${result.decoded.uid}`)
    } else {
      console.debug(`Failed to verify auth token due to ${result.error}`)
    }
  } else {
    console.debug("No auth token found in cookies")
  }

  const { email, uid } = result?.decoded || {}
  const userInfo = result?.decoded ? ({ email, uid } as UserInfo) : null

  return (
    <AuthenticationProvider {...{ isAuthenticated, userInfo }}>
      {children}
    </AuthenticationProvider>
  )
}

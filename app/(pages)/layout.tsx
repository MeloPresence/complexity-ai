import ClientPagesLayout from "@/components/layout/pages"
import { verifyIdToken } from "@/lib/server/firebase/auth"
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

  if (firebaseAuthToken) {
    const result = await verifyIdToken(firebaseAuthToken)
    if (result.decoded) {
      isAuthenticated = true
      console.debug(`Verified auth token: ${result.decoded.uid}`)
    } else {
      console.debug(`Failed to verify auth token: ${result.error}`)
    }
  } else {
    console.debug("No auth token found in cookies")
  }

  return (
    <ClientPagesLayout {...{ isAuthenticated }}>{children}</ClientPagesLayout>
  )
}

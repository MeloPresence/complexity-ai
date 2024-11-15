import ClientPagesLayout from "@/components/layout/pages"
import { auth } from "@/lib/server/firebase/app"
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
    await auth
      .verifyIdToken(firebaseAuthToken)
      .then((decoded) => {
        isAuthenticated = true
        console.log(`Verified auth token: ${decoded.uid}`)
      })
      .catch((err) => {
        console.log(`Failed to verify auth token: ${err}`)
      })
  } else {
    console.log("No auth token found in cookies")
  }

  return (
    <ClientPagesLayout {...{ isAuthenticated }}>{children}</ClientPagesLayout>
  )
}

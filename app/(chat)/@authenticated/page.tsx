"use client" // Firebase does client-side authentication!

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/firebase/auth"
import { useFirebaseUser } from "@/lib/firebase/user"
import { User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthenticatedChatPage() {
  const user: User | null | undefined = useFirebaseUser()
  const router = useRouter()
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [debugUserData, setDebugUserData] = useState<any>({})
  useEffect(() => {
    console.debug("(chat)/@authenticated/page.tsx useEffect", { user })
    if (user === undefined) return
    if (user) {
      setDebugUserData({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        providerId: user.providerId,
        providerData: user.providerData,
        phoneNumber: user.phoneNumber,
        metadata: user.metadata,
        tenantId: user.tenantId,
        photoURL: user.photoURL,
        refreshToken: user.refreshToken,
      })
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div>
      Authenticated Chat Page placeholder
      <div>{JSON.stringify(debugUserData, null, 2)}</div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

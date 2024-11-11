import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/client/firebase/auth"
import { User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function DebugUserInfo({ user }: { user: User | null | undefined }) {
  const router = useRouter()
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [debugUserData, setDebugUserData] = useState<any>({})
  useEffect(() => {
    console.debug("@/components/debug-user.tsx useEffect", { user })
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
    <div className="w-full">
      <div className="whitespace-pre">
        {JSON.stringify(debugUserData, null, 2)}
      </div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

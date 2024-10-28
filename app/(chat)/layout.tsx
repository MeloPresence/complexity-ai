"use client" // Firebase does client-side authentication!

import { useFirebaseUser } from "@/lib/firebase/user"
import { type User } from "firebase/auth"
import { useEffect, useState } from "react"

export default function Layout({
  anonymous,
  authenticated,
}: {
  anonymous: React.ReactNode
  authenticated: React.ReactNode
}) {
  const user: User | null | undefined = useFirebaseUser()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    console.debug("(chat)/layout.tsx useEffect", { user })
    if (user === undefined) return
    setIsAuthenticated(Boolean(user && !user.isAnonymous && user.emailVerified))
    setIsLoading(false)
  }, [user])
  return isLoading ? (
    <div>Loading</div>
  ) : (
    <>{isAuthenticated ? authenticated : anonymous}</>
  )
}

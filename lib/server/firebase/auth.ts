import { auth } from "@/lib/server/firebase/app"
import type { DecodedIdToken } from "firebase-admin/auth"
import { unstable_cache as cache } from "next/cache"

async function verifyIdTokenFn(
  token: string,
): Promise<{ decoded?: DecodedIdToken; error?: Error }> {
  console.debug("Uncached verifyIdTokenFn call!")
  try {
    const decoded = await auth.verifyIdToken(token)
    return { decoded }
  } catch (error) {
    return { error: error as Error }
  }
}

export const verifyIdToken = cache(verifyIdTokenFn, [], {
  revalidate: 10 * 60, // every 10 minutes
})

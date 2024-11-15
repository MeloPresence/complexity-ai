import { auth } from "@/lib/server/firebase/app"
import {
  type DecodedIdToken,
  type FirebaseAuthError,
} from "firebase-admin/auth"
import { unstable_cache as cache } from "next/cache"

async function verifyIdTokenFn(
  token: string,
): Promise<
  | { decoded: DecodedIdToken; error?: undefined }
  | { decoded?: undefined; error: FirebaseAuthError }
> {
  console.debug("Uncached verifyIdTokenFn call!")
  try {
    const decoded = await auth.verifyIdToken(token)
    return { decoded }
  } catch (error) {
    return { error: error as FirebaseAuthError }
  }
}

export const verifyIdToken = cache(verifyIdTokenFn, [], {
  revalidate: 10 * 60, // every 10 minutes
})

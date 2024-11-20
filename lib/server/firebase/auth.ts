import { auth } from "@/lib/server/firebase/app"
import { FIREBASE_AUTH_TOKEN_COOKIE } from "@/lib/utils"
import {
  type DecodedIdToken,
  type FirebaseAuthError,
} from "firebase-admin/auth"
import { unstable_cache as cache } from "next/cache"
import { cookies } from "next/headers"
import { logger } from "../logger"

type VerifyResult =
  | { decoded: DecodedIdToken; error?: undefined }
  | { decoded?: undefined; error: FirebaseAuthError }

async function verifyIdTokenFn(token: string): Promise<VerifyResult> {
  console.debug("Uncached verifyIdTokenFn call!")
  try {
    const decoded = await auth.verifyIdToken(token)
    return { decoded }
  } catch (error) {
    return { error: error as FirebaseAuthError }
  }
}

// Mutex map to track ongoing requests for the same token
const verifyInProgress = new Map<string, Promise<VerifyResult>>()

async function verifyIdTokenFnWithMutex(token: string): Promise<VerifyResult> {
  // Check if there is already an ongoing request for the same token
  if (verifyInProgress.has(token)) {
    // Wait for the ongoing request to finish and return its result
    return verifyInProgress.get(token)!
  }

  const before = Date.now()

  // Create a new request and store the promise in the in-progress map
  const request = verifyIdTokenFn(token)
    .then((result) => {
      // Cache the result once the promise is resolved
      verifyInProgress.delete(token)
      let message
      let initiatorUserId = null
      if (result.decoded) {
        message = "Verified Firebase auth ID token: valid"
        initiatorUserId = result.decoded.uid
      } else {
        message = "Verified Firebase auth ID token: invalid"
      }
      logger.info({
        type: "firebase-auth",
        action: "read",
        success: true,
        responseTime: Date.now() - before,
        message,
        initiatorUserId,
        endpoint: "firebase-admin/auth/verifyIdToken",
      })
      return result
    })
    .catch((error) => {
      verifyInProgress.delete(token)
      logger.error({
        type: "firebase-auth",
        action: "read",
        success: false,
        responseTime: Date.now() - before,
        message: "Failed to verify Firebase auth ID token",
        initiatorUserId: null,
        endpoint: "firebase-admin/auth/verifyIdToken",
      })
      throw error
    })

  verifyInProgress.set(token, request)

  // Return the result of the ongoing request
  return request
}

const cachedVerifyIdToken = cache(verifyIdTokenFnWithMutex, [], {
  revalidate: 10 * 60, // every 10 minutes
})

export async function verifyIdTokenFromCookies(): Promise<VerifyResult | null> {
  const cookieJar = cookies()
  const firebaseAuthToken =
    cookieJar.get(FIREBASE_AUTH_TOKEN_COOKIE)?.value || null
  if (firebaseAuthToken) return await cachedVerifyIdToken(firebaseAuthToken)
  return null
}

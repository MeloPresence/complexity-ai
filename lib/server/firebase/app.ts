import serviceAccount from "@/secrets/serviceAccountKey.json"
import { type App, cert, getApp, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const FIREBASE_SERVER_APP_NAME = "serverApp"

let firebaseServerApp: App

try {
  // Needed for hot reload in dev
  firebaseServerApp = getApp(FIREBASE_SERVER_APP_NAME)
} catch {
  firebaseServerApp = initializeApp(
    {
      credential: cert(serviceAccount),
    },
    FIREBASE_SERVER_APP_NAME,
  )
}

export const db = getFirestore(firebaseServerApp)

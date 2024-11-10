import serviceAccount from "@/secrets/serviceAccountKey.json"
import {
  type App,
  cert,
  getApp,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const FIREBASE_SERVER_APP_NAME = "serverApp"

let firebaseServerApp: App
let isAppFirstInitialized = false

try {
  // Needed for hot reload in dev
  firebaseServerApp = getApp(FIREBASE_SERVER_APP_NAME)
} catch {
  isAppFirstInitialized = true
  firebaseServerApp = initializeApp(
    {
      credential: cert(serviceAccount as ServiceAccount),
    },
    FIREBASE_SERVER_APP_NAME,
  )
}

export const db = getFirestore(firebaseServerApp)
if (isAppFirstInitialized) db.settings({ ignoreUndefinedProperties: true })

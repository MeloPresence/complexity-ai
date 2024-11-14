import {
  type App,
  cert,
  getApp,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const FIREBASE_SERVER_APP_NAME = "serverApp"

const serviceAccount = {
  type: process.env.FIREBASE_CREDENTIALS_TYPE,
  project_id: process.env.FIREBASE_CREDENTIALS_PROJECT_ID,
  private_key_id: process.env.FIREBASE_CREDENTIALS_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_CREDENTIALS_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CREDENTIALS_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CREDENTIALS_CLIENT_ID,
  auth_uri: process.env.FIREBASE_CREDENTIALS_AUTH_URI,
  token_uri: process.env.FIREBASE_CREDENTIALS_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CREDENTIALS_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_CREDENTIALS_UNIVERSE_DOMAIN,
} as ServiceAccount

let firebaseServerApp: App
let isAppFirstInitialized = false

try {
  // Needed for hot reload in dev
  firebaseServerApp = getApp(FIREBASE_SERVER_APP_NAME)
} catch {
  isAppFirstInitialized = true
  firebaseServerApp = initializeApp(
    {
      credential: cert(serviceAccount),
    },
    FIREBASE_SERVER_APP_NAME,
  )
}

export const db = getFirestore(firebaseServerApp)
if (isAppFirstInitialized) db.settings({ ignoreUndefinedProperties: true })

export const auth = getAuth(firebaseServerApp)

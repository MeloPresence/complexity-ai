import serviceAccount from "@/secrets/serviceAccountKey.json"
import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

export const firebaseServerApp = initializeApp({
  credential: cert(serviceAccount),
})
export const db = getFirestore(firebaseServerApp)

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getFirebaseAuthKey(): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open("firebaseLocalStorageDb")

    request.onerror = (event) => {
      reject(
        new Error(
          "Failed to open IndexedDB: " + (event.target as IDBRequest).error,
        ),
      )
    }

    request.onsuccess = async (event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase

      // Start a transaction to access the 'firebaseLocalStorage' object store
      const transaction = db.transaction("firebaseLocalStorage", "readonly")
      const store = transaction.objectStore("firebaseLocalStorage")

      // Perform a 'get' operation to retrieve the value
      const getRequest = store.getAll()

      getRequest.onerror = (event) => {
        reject(
          new Error(
            "Failed to get value from IndexedDB: " +
              (event.target as IDBRequest).error,
          ),
        )
      }

      getRequest.onsuccess = () => {
        const result = getRequest.result
        if (result !== undefined) {
          resolve(result) // Successfully retrieved value
        } else {
          resolve(null) // Key does not exist in the store
        }
      }
    }
  })
}

// lib/firebase-admin.ts
// This file should ONLY be imported by server-side code (e.g., API routes, Server Actions).
// It initializes the Firebase Admin SDK with robust error handling and emulator support.

import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let app: App
let db: Firestore

function initializeFirebaseAdmin(): { app: App; db: Firestore } {
  // Check if Firebase Admin is already initialized
  const existingApps = getApps()
  
  if (existingApps.length > 0) {
    console.log("Firebase Admin SDK already initialized, using existing app.")
    app = existingApps[0]
    db = getFirestore(app)
    return { app, db }
  }

  const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST
  const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
  const isEmulator = FIRESTORE_EMULATOR_HOST !== undefined && FIRESTORE_EMULATOR_HOST !== ""

  if (!FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is required in environment variables.")
  }

  try {
    if (isEmulator) {
      console.log(`🔧 Firebase Admin SDK connecting to Firestore emulator at: ${FIRESTORE_EMULATOR_HOST}`)
      console.log(`📁 Using project ID: ${FIREBASE_PROJECT_ID}`)
      
      // Initialize app for emulator (no credentials needed)
      app = initializeApp({
        projectId: FIREBASE_PROJECT_ID,
      })
      
      // Get Firestore instance and configure for emulator
      db = getFirestore(app)
      db.settings({
        host: FIRESTORE_EMULATOR_HOST,
        ssl: false,
      })
      
      console.log("✅ Firebase Admin SDK initialized for emulator mode")
    } else {
      // Production mode: require full service account credentials
      const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL
      const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY

      if (!FIREBASE_CLIENT_EMAIL) {
        throw new Error("FIREBASE_CLIENT_EMAIL is required for production mode.")
      }
      if (!FIREBASE_PRIVATE_KEY) {
        throw new Error("FIREBASE_PRIVATE_KEY is required for production mode.")
      }

      console.log("🚀 Firebase Admin SDK initializing for production mode")
      console.log(`📁 Using project ID: ${FIREBASE_PROJECT_ID}`)
      
      app = initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines
        }),
      })
      
      db = getFirestore(app)
      console.log("✅ Firebase Admin SDK initialized for production mode")
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error)
    throw new Error(`Firebase Admin SDK initialization failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  return { app, db }
}

// Initialize Firebase Admin SDK
const { app: firebaseApp, db: firestore } = initializeFirebaseAdmin()

// Export the initialized instances
export { firebaseApp as app, firestore as db }

// Export a function to get a fresh Firestore instance if needed
export function getFirestoreInstance(): Firestore {
  if (!db) {
    const { db: freshDb } = initializeFirebaseAdmin()
    return freshDb
  }
  return db
}
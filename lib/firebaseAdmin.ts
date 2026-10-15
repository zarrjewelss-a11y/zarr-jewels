import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function getServiceAccount(): Record<string, unknown> {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    "";

  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error(
      "Missing Firebase service account credentials. Please configure FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT_KEY."
    );
  }

  // 1. Direct JSON (starts with '{')
  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Continue to other formats if direct parse fails
    }
  }

  // 2. Base64 (strip all whitespace and newlines before decoding)
  const cleanedBase64 = trimmed.replace(/\s+/g, "");
  try {
    const decoded = Buffer.from(cleanedBase64, "base64").toString("utf-8");
    if (decoded.trim().startsWith("{")) {
      return JSON.parse(decoded);
    }
  } catch {
    // Continue
  }

  // 3. String wrapped in outer quotes (e.g. from environment variable paste)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const unquoted = trimmed.slice(1, -1).trim();
    if (unquoted.startsWith("{")) {
      return JSON.parse(unquoted);
    }
    try {
      const decoded = Buffer.from(unquoted.replace(/\s+/g, ""), "base64").toString("utf-8");
      if (decoded.trim().startsWith("{")) {
        return JSON.parse(decoded);
      }
    } catch {
      // Continue
    }
  }

  // 4. Fallback attempt: direct JSON parse
  return JSON.parse(trimmed);
}

let _adminApp: App | null = null;
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

export function getAdminApp(): App {
  if (!_adminApp) {
    if (getApps().length > 0) {
      _adminApp = getApps()[0];
    } else {
      const serviceAccount = getServiceAccount();
      _adminApp = initializeApp({
        credential: cert(serviceAccount as any),
      });
    }
  }
  return _adminApp;
}

export function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getAdminApp());
  }
  return _adminDb;
}

export function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getAdminApp());
  }
  return _adminAuth;
}

// Lazy Proxies so importing this module at build time never throws even if env vars are unset
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getAdminDb();
    const val = (db as any)[prop];
    if (typeof val === "function") {
      return val.bind(db);
    }
    return val;
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    const auth = getAdminAuth();
    const val = (auth as any)[prop];
    if (typeof val === "function") {
      return val.bind(auth);
    }
    return val;
  },
});

export default getAdminApp;
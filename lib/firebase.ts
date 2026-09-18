import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKkSjN_ZLOpAE_T7v8dAIhrQEzDtfOsbo",
  authDomain: "zarr-jewels.firebaseapp.com",
  projectId: "zarr-jewels",
  storageBucket: "zarr-jewels.firebasestorage.app",
  messagingSenderId: "1019571598644",
  appId: "1:1019571598644:web:c82a9fd7f1861e95c32161"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export default app;
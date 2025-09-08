import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbdZ2NXFEYyl5kgrTdkVmMZL4qwp7UORc",
  authDomain: "mini-tandem-42a5f.firebaseapp.com",
  projectId: "mini-tandem-42a5f",
  storageBucket: "mini-tandem-42a5f.firebasestorage.app",
  messagingSenderId: "314595406496",
  appId: "1:314595406496:web:11043dbc1ce5fa6ccb4fc5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

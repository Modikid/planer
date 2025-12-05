import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo1tLQhljW0IJNHvo7Iv-6YiYq6kzWMaA",
  authDomain: "planer-2025.firebaseapp.com",
  projectId: "planer-2025",
  storageBucket: "planer-2025.firebasestorage.app",
  messagingSenderId: "164783494100",
  appId: "1:164783494100:web:0335396b095dbf0d063c41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

export default app;

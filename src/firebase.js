import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyAwKBYQoHNfvLdeD2WDnfQQoC_yOYX4YZk",
  authDomain:        "ecole-direct-2ec0c.firebaseapp.com",
  projectId:         "ecole-direct-2ec0c",
  storageBucket:     "ecole-direct-2ec0c.firebasestorage.app",
  messagingSenderId: "494378561542",
  appId:             "1:494378561542:web:658ab309986ed3391a5387",
  measurementId:     "G-YBFHGR6LRY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

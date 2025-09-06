import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDM0WWplc5BKHn2Ganazi6dPC_XI5COGGk",
  authDomain: "catalogo-ab-727a9.firebaseapp.com",
  projectId: "catalogo-ab-727a9",
  storageBucket: "catalogo-ab-727a9.firebasestorage.app",
  messagingSenderId: "248708583751",
  appId: "1:248708583751:web:4d837c60a9c1d14eb7bc62",
  measurementId: "G-MZKXBGGXG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
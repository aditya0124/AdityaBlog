// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrtLqy9BEKdspJ2Ocldb_-xsHKraTzJfg",

  authDomain: "blog-84770.firebaseapp.com",

  projectId: "blog-84770",

  storageBucket: "blog-84770.appspot.com",

  messagingSenderId: "594068820572",

  appId: "1:594068820572:web:be1a177bd1bc8f37f98c99",

  measurementId: "G-HCFLTFMBP1",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

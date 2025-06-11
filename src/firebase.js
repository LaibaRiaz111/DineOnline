// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCqlcFOXqNaN5oax_Mmw0bkk2KV8O-xN5k",
    authDomain: "dineonline-910ff.firebaseapp.com",
    projectId: "dineonline-910ff",
    storageBucket: "dineonline-910ff.firebasestorage.app",
    messagingSenderId: "640421901991",
    appId: "1:640421901991:web:a8ea8d5dc258325f0b8d82",
    measurementId: "G-FVYX620JGE"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

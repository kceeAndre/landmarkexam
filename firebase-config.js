// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpQj1W6KGnTKuJRlPZMIh9z5DsHOVbezA",
  authDomain: "landmark-cbt.firebaseapp.com",
  databaseURL: "https://landmark-cbt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "landmark-cbt",
  storageBucket: "landmark-cbt.firebasestorage.app",
  messagingSenderId: "314935059696",
  appId: "1:314935059696:web:55d1a65bf0e23d32fa4e35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database
const db = getDatabase(app);

export { db };
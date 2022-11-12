// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdvIYGkXBiOBdN01vPypfSbkFyWcU5jNY",
  authDomain: "navigrade.firebaseapp.com",
  projectId: "navigrade",
  storageBucket: "navigrade.appspot.com",
  messagingSenderId: "858684734715",
  appId: "1:858684734715:web:3c29e87ea25ce12848845e",
  measurementId: "G-W6VT4N33DW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
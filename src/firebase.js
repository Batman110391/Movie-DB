import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export const firebaseCongif = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD9p83mDv0lU7XeiTa7DJIPMTU5gJQ2VdE",
    authDomain: "db-movie-3894b.firebaseapp.com",
    projectId: "db-movie-3894b",
    storageBucket: "db-movie-3894b.appspot.com",
    messagingSenderId: "432012777561",
    appId: "1:432012777561:web:7674009f6cba8048653948",
    measurementId: "G-ZDHX9X3RGM",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
};

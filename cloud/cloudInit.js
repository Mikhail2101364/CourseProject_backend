// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyCYLYpRpPRPAhaNqcWR-RFNwECSZn2NkWk",
    authDomain: "savvy-hall-379510.firebaseapp.com",
    projectId: "savvy-hall-379510",
    storageBucket: "savvy-hall-379510.appspot.com",
    messagingSenderId: "818082930635",
    appId: "1:818082930635:web:a5cf41973c47b723ba604e",
    measurementId: "G-LD1RFYD3PG"
  };

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

module.exports = {
    firebase,
};

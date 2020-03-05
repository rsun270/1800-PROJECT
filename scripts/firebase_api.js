  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCqKfMvCHb1tUQ6GSQ7bAmE3f3cij6KZmg",
    authDomain: "gymfinder-app.firebaseapp.com",
    databaseURL: "https://gymfinder-app.firebaseio.com",
    projectId: "gymfinder-app",
    storageBucket: "gymfinder-app.appspot.com",
    messagingSenderId: "318996314247",
    appId: "1:318996314247:web:62be32d16bbc5364272022"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
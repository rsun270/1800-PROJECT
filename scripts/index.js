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
// let app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore(app);
const form = document.querySelector('#addPostalCode');
let loggedIn = false;
let userRef;
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("I am logged in!");
            loggedIn = true;
            console.log(firebase.auth().currentUser);
            userRef = db.collection("users").doc(user.uid);
        } else {
            // No user is signed in.
            console.log("I am not logged in!");
            loggedIn = false;
        }
    });
}

window.addEventListener('load', function () {
    initApp();
});


function submitPostalCode() {
    let currentPostalCode = document.getElementById("pCode").value;
    if (loggedIn) {
        console.log(userRef);
  
        // var setWithMerge = userRef.set({
        //     postalCode : currentPostalCode
        // }, { merge: true });
        // return setWithMerge;

        userRef.set({ "postal code" : currentPostalCode}, { merge: true });

        // firebase.auth().currentUser.set({"Postal Code" : currentPostalCode },{merge:true});
    } else {
        localStorage.setItem("postalCodeLocal", currentPostalCode);
        console.log(localStorage.getItem("postalCodeLocal"));
    }
}




form.addEventListener('submit', (e) => {
    e.preventDefault();
});

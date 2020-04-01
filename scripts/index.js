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
let app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
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
    }
}




form.addEventListener('submit', (e) => {
    e.preventDefault();
});
function findByCode(postalcode) {    
    db.collection("gyms").get().then(function (snap) {
        snap.forEach(function (doc) { //cycle thru collection of all gyms
            var postalCode = doc.data().postal_code; //get location of a gym
            var d = calcDistance(x1, y1, x2, y2);
            if (d < dmin) {
                dmin = d;
                localStorage.setItem("closest", doc.data().name); //name of the closest gym
            }
        });
    });
    var closest = localStorage.getItem("closest"); //get closest
    console.log(closest);
    //displayGym(closest);
}

function getDistance() {

}


function getLongLatFromPostal(postalCode) {
    var geocoder = new google.maps.Geocoder();
    var lat = '';
    var lng = '';
    var address = postalCode;
    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         lat = results[0].geometry.location.lat();
         lng = results[0].geometry.location.lng();
        } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
    return [lat, lng];
}


function calcDistance(x1, y1, x2, y2) {
    return 10; // use pythagoras thm to cacluate distance between 2 points
}

getLongLatFromPostal("V5E1V1");

// MAPS API KEY
// AIzaSyCWLNBdT0HsvpDLqGjV5pqBONvtCIiM4p8

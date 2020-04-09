//======================//
// Constants            //
//======================//

const form = document.querySelector('#addPostalCode');

//======================//
// Global Variables     //
//======================//

let loggedIn = false;
let userRef;

// Checks for postal codes, asks for one if none exist
initApp = function () {
    disableFindButton();
    document.getElementById("findGymButton").style.visibility = "visible";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("I am logged in!");
            userRef = db.collection("users").doc(user.uid);
            userRef.get().then(function (userDoc) {
                console.log("Signed in user's postal code: " + userDoc.data()["postal code"]);
                if (userDoc.data()["postal code"] == undefined) {
                    disableFindButton();
                    alert("Set a postal code.");
                } else {
                    enableFindButton();
                }
            });
            loggedIn = true;
            console.log(firebase.auth().currentUser);
        } else {
            // No user is signed in.
            console.log("I am not logged in!");
            if (localStorage.getItem("postalCodeLocal") == undefined) {
                disableFindButton();
                alert("Set a postal code.");
            } else {
                enableFindButton();
            }
            loggedIn = false;

        }
    });
}

// Listens for the window be loaded
window.addEventListener('load', function () {
    initApp();
});

// Listens for a click on the submit button, preventing a default value
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Saves the user's postal code into their account or localStorage based on login status
function submitPostalCode() {
    let currentPostalCode = document.getElementById("pCode").value;
    if (loggedIn) {
        console.log(userRef);
        userRef.set({
            "postal code": currentPostalCode
        }, {
            merge: true
        });
        enableFindButton();
        alert("Your postal code, " + currentPostalCode + ", has been saved to your account.");
    } else {
        localStorage.setItem("postalCodeLocal", currentPostalCode);
        enableFindButton();
        alert("Your postal code, " + currentPostalCode + ", has been applied.");
        console.log(localStorage.getItem("postalCodeLocal"));
    }
}

// Enables the Find a Gym button's functionality
function enableFindButton() {
    document.getElementById("findGymButton").href = "results.html";
    document.getElementById("findGymButton").style.cursor = "pointer";
    document.getElementById("findGymImg").style.opacity = 1;
}

// Disables the Find a Gym button's functionality
function disableFindButton() {
    document.getElementById("findGymButton").href = "#";
    document.getElementById("findGymButton").style.cursor = "not-allowed";
    document.getElementById("findGymImg").style.opacity = 0.5;
}

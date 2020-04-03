const form = document.querySelector('#addPostalCode');
let loggedIn = false;
let userRef;


initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("I am logged in!");
            userRef = db.collection("users").doc(user.uid);
            userRef.get().then(function (userDoc) {
                console.log(userDoc.data()["postal code"]);
                if (userDoc.data()["postal code"] == undefined) {
                    disableFindButton();
                    alert("Set a postal code.");
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
            }
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

        userRef.set(
            { "postal code" : currentPostalCode}, { merge: true });
        enableFindButton();
        alert("Your postal code, " + currentPostalCode + ", has been saved to your account.");

        // firebase.auth().currentUser.set({"Postal Code" : currentPostalCode },{merge:true});
    } else {
        localStorage.setItem("postalCodeLocal", currentPostalCode);
        enableFindButton();
        console.log(localStorage.getItem("postalCodeLocal"));
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

function enableFindButton() {
    document.getElementById("findGymButton").href = "results.html";
    document.getElementById("findGymButton").style.cursor = "pointer";
    document.getElementById("findGymImg").style.opacity = 1;
}

function disableFindButton() {
    document.getElementById("findGymButton").href = "#";
    document.getElementById("findGymButton").style.cursor = "not-allowed";
    document.getElementById("findGymImg").style.opacity = 0.5;
}

//======================//
// Functions            //
//======================//

// Displays profile if signed in, tells user to sign in if signed out
initApp = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      updateNavBar();
      getPostalCode(user);
      let displayName = user.displayName;
      let email = user.email;

      document.getElementById("user_name").innerHTML = displayName;
      document.getElementById("user_email_address").innerHTML = email;

      let userRef = firebase.database().ref('users/' + user.uid + '/name');
      userRef.on('value', function (snapshot) {
        document.write(snapshot.val());
      });
      //document.getElementById("postalcode").innerHTML = "Set your postal code.";
    } else {
      // No user is signed in.
      document.getElementById("settings_container").style.display = "none";
      let settingsMessage = document.createElement("h1");
      settingsMessage.innerHTML = "Please sign in before trying to adjust settings.";
      document.body.appendChild(settingsMessage);
    }
  });
}

// Triggers when the window loads
window.addEventListener('load', function () {
  initApp();
});

// Updates navBar's buttons
function updateNavBar() {
  document.getElementById("index_link").href = "main.html";
}

// When Change button is clicked, the user's postal code is updated to what was entered in the textfield
function setPostalCode() {
  let code = document.getElementById("code").value; // get postal code from DOM
  let user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).update({
    "postal code": code
  });
  alert("Your postal code has been updated.")
}

/**
 * Listens for changes in user doc and updates postal code when triggered
 * 
 * @param user the logged in user
 */
function getPostalCode(user) {
  db.collection("users").doc(user.uid).onSnapshot(function (userDoc) {
    postalCode.innerHTML = userDoc.data()["postal code"];
  });
}

//======================//
// Main                 //
//======================//
let postalCode = document.getElementById("postalcode");


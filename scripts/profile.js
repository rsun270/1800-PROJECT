//======================//
// Functions            //
//======================//

// Displays profile if signed in, tells user to sign in if signed out
initApp = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      profileContent.style.visibility = "visible";
      updateNavBarSignedIn();
      getPostalCode(user);
      let displayName = user.displayName;
      let email = user.email;

      document.getElementById("user_name").innerHTML = displayName;
      document.getElementById("user_email_address").innerHTML = email;

      let userRef = firebase.database().ref('users/' + user.uid + '/name');
      userRef.on('value', function (snapshot) {
        document.write(snapshot.val());
      });
    } else {
      // No user is signed in.
      updateNavBarSignedOut();
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

// Makes the home button redirect to main.html
function updateNavBarSignedIn() {
  document.getElementById("index_link").href = "main.html";
}

// Updates the nav bar to reflect correct options for a signed out user
function updateNavBarSignedOut() {
  let profile = document.getElementById("profile");
  profile.parentNode.removeChild(profile);

  let logOut = document.getElementById("logout");
  logOut.innerHTML = "Login/Signup";
  logOut.href = "login.html";
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
let profileContent = document.getElementById("settings_container");
let postalCode = document.getElementById("postalcode");



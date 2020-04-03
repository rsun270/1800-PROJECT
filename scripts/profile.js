initApp = function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.

      updateNavBar();

      let displayName = user.displayName;
      let email = user.email;
      document.getElementById("user_name").innerHTML = displayName;
      document.getElementById("user_email_address").innerHTML = email;
      let userRef = firebase.database().ref('users/' + user.uid + '/name');
      userRef.on('value', function (snapshot) {
        document.write(snapshot.val());
      });
      document.getElementById("postalcode").innerHTML = "Set your postal code.";
    } else {
      // No user is signed in.
      document.getElementById("settings_container").style.display = "none";
      let settingsMessage = document.createElement("h1");
      settingsMessage.innerHTML = "Please sign in before trying to adjust settings.";
      document.body.appendChild(settingsMessage);
    }
  });
}

window.addEventListener('load', function () {
  initApp();
});

/** updates navBar's buttons if user is signed in */
function updateNavBar() {
  document.getElementById("index_link").href = "main.html";
}

/** updates user postal code to database */
function setPostalCode(code) {
  firebase.auth().onAuthStateChanged(function (user) {
    db.collection("users").doc(user.uid).update({
      "postal code": code
    });
  })
}

/** when Change button is clicked, the user's postal code is updated to what was entered in the textfield */
function setPostalCode() {
  let code = document.getElementById("code").value // get postal code from DOM

  let user = firebase.auth().currentUser;

  db.collection("users").doc(user.uid).update({
    "postal code": code
  });
  alert("Your postal code has been updated.")
}

/** MAIN */
let postalCode = document.getElementById("postalcode");
// TODO:
postalCode.innerHTML = "user's postal code in the db";
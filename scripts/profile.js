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
      document.getElementById("user_postal_code").innerHTML = "Set your postal code.";
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


// remove
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

/** handles submit button click */
function clickHandler(event) {
  log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  event.preventDefault();
}

const form = document.getElementById('text');
const log = document.getElementById('log');
form.addEventListener('submit', logSubmit);


/** MAIN */
let postalCode = document.getElementById("postalcode")
postalCode.innerHTML = localStorage.getItem("postalCodeLocal");
document.getElementById("changecode").onclick = setPostalCode(postalCode);




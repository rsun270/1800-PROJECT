initApp = function() {
    firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        updateNavBar();

        let displayName = user.displayName;
        let email = user.email;
        document.getElementById("user_name").innerHTML = displayName;
        document.getElementById("user_email_address").innerHTML = email;
        let userRef = firebase.database().ref('users/' + user.uid + '/name');
        userRef.on('value', function(snapshot) {
            document.write(snapshot.val());
        });
        document.getElementById("user_postal_code").innerHTML = "Set your postal code.";
    } else {
        // No user is signed in.
        document.getElementById("settings_container").style.display= "none";
        let settingsMessage = document.createElement("h1");
        settingsMessage.innerHTML = "Please sign in before trying to adjust settings.";
        document.body.appendChild(settingsMessage);
    }
});
}

window.addEventListener('load', function () {
    initApp();
});

// Directs to correct homepage based on log in status
function homeClick() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        document.location.href = "main.html";
      } else {
        // No user is signed in.
        document.location.href = "index.html";
      }
    });
  }


/** updates navBar's buttons if user is signed in */
function updateNavBar(){
    document.getElementById("index_link").href = "main.html";
}
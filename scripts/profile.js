initApp = function() {
    firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
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
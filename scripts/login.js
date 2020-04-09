// FirebaseUI config
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            var user = authResult.user;
            let uniqueUser = authResult.additionalUserInfo.isNewUser;
            let dbRef = db.collection("users").doc(user.uid);
            if (uniqueUser) {
                // User is a new user, add to database
                dbRef.set({
                        name: user.displayName,
                        email: user.email
                    }).then(function () {
                        console.log("New user added to firestore");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {}
            return true;
        },
        uiShown: function () {
            // UI is now displaying
        }
    },
    signInSuccessUrl: 'main.html',
    credentialHelper: 'none', // disables the credential helper page that lists all accounts saved in history
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
    }
};

//======================//
// Functions            //
//======================//

// Updates the nav bar to reflect correct options for a signed in user
function updateNavBar() {
    let profile = document.getElementById("profile");
    profile.innerHTML = "Profile";
    profile.href = "profile.html";

    let logOut = document.getElementById("logout");
    logOut.innerHTML = "Log Out";
    logOut.href = "login.html";

    document.getElementById("index_link").href = "main.html";
}

// Signs the user out
function signUserOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        localStorage.removeItem("postalCodeLocal");
        document.location
    }).catch(function (error) {
        // An error happened.
    });
    location.reload();
}

// Alters sign in status visually when window is loaded
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.       
            updateNavBar();
            document.getElementById('sign-in').style.visibility = "visible";
            let displayName = user.displayName;
            let email = user.email;
            user.getIdToken().then(function (accessToken) {
                document.getElementById('sign-in-status').textContent = 'Signed in as ' + displayName;
                document.getElementById('sign-in').innerHTML = 'Sign out';
            });
        } else {
            document.getElementById('sign-in-status').textContent = 'Signed out';
            // Initialize the FirebaseUI Widget using Firebase.
            let ui = new firebaseui.auth.AuthUI(firebase.auth());

            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
            document.getElementById('sign-in').style.visibility = "hidden";
        }
    }, function (error) {
        console.log(error);
    });
};

// Triggers when the window is loaded
window.addEventListener('load', function () {
    initApp();
});

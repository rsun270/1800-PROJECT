// FirebaseUI config.
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
                        // window.location.assign("main.html");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
          }
        },
        signInSuccessUrl: 'main.html',
        credentialHelper: 'none',
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

/** <a id="profile" class="nav-link" href="login.html">Login</a>
                </li>
                <li class="nav-item">
                    <a id="logout" class="nav-link" href=""></a> */


function updateNavBar(){
    let profile = document.getElementById("profile");
    profile.innerHTML = "Profile";
    profile.href = "profile.html";

    let logOut = document.getElementById("logout");
    logOut.innerHTML = "Log Out";
    logOut.href = "login.html";

    document.getElementById("index_link").href = "main.html";
}


function signUserOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        localStorage.removeItem("postalCodeLocal");
      }).catch(function(error) {
        // An error happened.
      });
      location.reload();
}

let ui;
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
                // document.getElementById('account-details').textContent = JSON.stringify({
                //     displayName: displayName,
                //     email: email,
                //     // accessToken: accessToken,
                // }, null, '  ');
            });
        } else {
            document.getElementById('sign-in-status').textContent = 'Signed out';
            // User is signed out.
            if (ui) {
                ui.reset();
            } else {
                // Initialize the FirebaseUI Widget using Firebase.
                ui = new firebaseui.auth.AuthUI(firebase.auth());
            }
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
            document.getElementById('sign-in').style.visibility = "hidden";
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp();
});

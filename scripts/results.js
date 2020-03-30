function homeClick() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          document.location.href = "main.html";
        } else {
          // No user is signed in.
          document.location.href = "index.html";
        }
      });
}

//======================//
// Global variables     //
//======================//
var gymID = localStorage.getItem("Loaded Gym");
console.log(gymID);
var docRef = db.collection("gyms").doc(gymID);

//======================//
// Functions            //
//======================//

/**
 * Grabs gym based off of gymID that was passed to this page and displays a map
 * and a card for the gym.
 */
function grabGymById() {
  docRef.get().then(function (doc) {
    if (doc.exists) {
      createOneCard(doc);
      generateMap(doc);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
}

/**
 * Creates a gym card and displays it.
 * 
 * @param {document} c the gym's document
 */
function createOneCard(c) {
  var coldiv = document.createElement("div");
  coldiv.setAttribute("class", "col-md-3");

  var carddiv = document.createElement("div");
  carddiv.setAttribute("class", "card");

  var cardbodydiv = document.createElement("div");
  cardbodydiv.setAttribute("class", "card-body");

  // Gym name
  var name = document.createElement("h4");
  name.setAttribute("class", "card-title");
  var text = document.createTextNode(c.data().name);
  name.appendChild(text);

  // The distance
  var distance = document.createElement("p");
  distance.setAttribute("class", "card-text");
  var text = document.createTextNode("Distance");
  distance.appendChild(text);

  // The address
  var address = document.createElement("p");
  address.setAttribute("class", "card-text");
  var text = document.createTextNode(c.data().address);
  address.appendChild(text);

  // The drop-in price
  var price = document.createElement("p");
  price.setAttribute("class", "card-text");
  if (!isNaN(c.data().price)) {
    var text = document.createTextNode("Drop-in price: $" + c.data().price);
    price.appendChild(text);
  } else {
    var text = document.createTextNode("Drop-in price: " + c.data().price);
    price.appendChild(text);
  }

  // // The occupancy
  // var occupancy = document.createElement("p");
  // occupancy.setAttribute("class", "card-text");
  // var text = document.createTextNode("Occupancy: " + c.data().occupancy);
  // occupancy.appendChild(text);

  var map = document.createElement("div");

  // Stitch it all together 
  cardbodydiv.appendChild(name);
  //cardbodydiv.appendChild(distance);
  cardbodydiv.appendChild(address);
  cardbodydiv.appendChild(price);
  // cardbodydiv.appendChild(occupancy); // not functional yet
  //cardbodydiv.appendChild(map);
  carddiv.appendChild(cardbodydiv);
  coldiv.appendChild(carddiv);
  document.getElementById("card").appendChild(coldiv); //stick it in the div
}

/**
 * Generates and displays a Google map with the gym's location on it.
 * 
 * @param c the gym's document
 */
function generateMap(c) {
  document.getElementById("gmap_canvas").src = c.data().map;
}

// Updates the nav bar to reflect correct options for a signed in user
function updateNavBar() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      let profile = document.getElementById("profile");
      profile.innerHTML = "Profile";
      profile.href = "profile.html";
    
      let logOut = document.getElementById("logout");
      logOut.innerHTML = "Log Out";
      logOut.href = "login.html";
      document.getElementById("index_link").onclick = function() {
        document.location.href = "main.html";
      } 
      console.log("Read all lines.");
    } else {
      document.getElementById("index_link").onclick = function() {
        document.location.href = "index.html";
      };
      let profile = document.getElementById("profile");
      profile.parentNode.removeChild(profile);
    }
  });
}

//======================//
// Main                 //
//======================//
grabGymById(gymID);
updateNavBar();

//======================//
// Global Variables     //
//======================//
let dbRef = db.collection("gyms");
let userPostalCode;
let distances = []; // array to store gym distances in
let idCounter = 0;
let distanceCardArray = [];
let gymList = [];

//======================//
// Functions            //
//======================//

// Sorts list by distance (closest to farthest)
function sortByDistance() {
  document.getElementById("cards").innerHTML = '';
  removeFilters();
  // Distances contains an array with an object for each gym containing a gym_id: value and distance: value
  dbRef.get().then(function (snap) {
    // Display a card for each document in the array
    displayCards(snap);
    // Converts the HTML collection to an array of elements
    let gymCardsList = Array.prototype.slice.call(document.getElementsByClassName("gymCard"));
    // console.log(gymCardsList.length);
    for (let i = 0; i < gymCardsList.length; i++) {
      gymCardsList[i] = gymCardsList[i].id;
    }
    // console.log(gymCardsList);
    gymCardsList.sort(function (a, b) {
      return a - b;
    });
    for (let i = 0; i < gymCardsList.length; i++) {
      let card = document.getElementById(gymCardsList[i]);
      document.getElementById("cards").appendChild(card); //stick it in the div
    }
  })
}

// Sorts list by price (lowest to highest)
function sortByPrice() {
  document.getElementById("cards").innerHTML = '';
  removeFilters();
  dbRef.orderBy("price")
    .get()
    .then(function (snap) {
      displayCards(snap);
    });
}

// Applys filters and displays results
function sortByFilters() {
  // console.log(typeof localStorage.getItem("filterList"));
  let filterListArray = JSON.parse(localStorage.getItem("filterList"));
  // console.log(filterListArray);
  dbRef.get().then(function (snap) {
    snap.forEach(function (doc1) {
      // console.log(doc1.id, doc1.data().Filters);
      compareArray(filterListArray, doc1.data().Filters, doc1.id);
    });
    console.log(gymList);
    displayCards(snap);
  });
}


/**
 * Compares the array of selected filters to the amenities of the gym.
 * If the number of matching filters is equal to the length of list of
 * selected filters, add it to the list of gyms to display.
 * 
 * @param {array} arr1 the array of selected filters
 * @param {array} arr2 the array of amenities the gym has
 * @param {string} arr2ID the id of the gym document
 */
function compareArray(arr1, arr2, arr2ID) {
  let counter = 0;
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) {
        counter++;
      }
    }
  }
  if (counter == arr1.length) {
    gymList.push(arr2ID);
  }
}

// Removes filters and sorts by distance
function removeFilters() {
  document.getElementById("filters_applied").innerHTML = "No filters applied";
  if (localStorage.getItem("filterList") != "") {
    localStorage.setItem("filterList", "");
    sortByDistance();
  }
}

/**
 * Displays the gym cards.
 * 
 * @param CardObjects the collection of gyms
 */
function displayCards(CardObjects) { //takes in collection
  if (localStorage.getItem("filterList").length == 0) {
    CardObjects.forEach(function (doc) { //cycle thru collection
      createOneCard(doc); //create card for one recipe/gym
    })
  } else {
    CardObjects.forEach(function (doc) { //cycle thru collection
      if (gymList.includes(doc.id)) {
        createOneCard(doc); //create card for one recipe/gym
      }
    })
  }

}

/**
 * Creates a gym card.
 * 
 * @param c the gym document
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

  // Distance
  var distance = document.createElement("p");
  distance.setAttribute("class", "card-text");
  // Loops through each object in distances array
  for (let i = 0; i < distances.length; i++) {
    if (distances[i].gym_id === c.id) {
      // Object gym_id value matches db document id
      var text = document.createTextNode(distances[i].distance.toFixed(2) + " km away");
      coldiv.setAttribute("id", distances[i].distance + "");
      coldiv.setAttribute("class", "gymCard col-md-3");
      break;
    }
  }
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

  // The occupancy
  var occupancy = document.createElement("p");
  occupancy.setAttribute("class", "card-text");
  var text = document.createTextNode("Occupancy: " + c.data().occupancy);
  occupancy.appendChild(text);

  // The amenities
  var gymAttribute = document.createElement("p");
  gymAttribute.setAttribute("class", "card-text");
  var text = document.createTextNode("Amenities: " + c.data().Filters);
  gymAttribute.appendChild(text);

  // View Gym button
  var a = document.createElement("input");
  a.type = "button"
  a.setAttribute("value", "View Gym");
  a.addEventListener('click', function () {
    loadPage(c.id);
  });
  a.setAttribute("class", "btn btn-outline-secondary");
  var text = document.createTextNode("View Gym");
  a.appendChild(text);

  // Stitch it all together 
  cardbodydiv.appendChild(name);
  cardbodydiv.appendChild(distance);
  cardbodydiv.appendChild(address);
  cardbodydiv.appendChild(price);
  cardbodydiv.appendChild(occupancy);
  cardbodydiv.appendChild(gymAttribute);
  cardbodydiv.appendChild(a);
  carddiv.appendChild(cardbodydiv);
  coldiv.appendChild(carddiv);
  document.getElementById("cards").appendChild(coldiv); //stick it in the div
}

/**
 * Gets the lat and long of a postal code.
 * 
 * @param {string} postalCode user's postal code
 * @param {function} callback code to execute once geocode results have been received
 */
function getLatLongFromPostal(postalCode, callback) {
  var geocoder = new google.maps.Geocoder();
  var address = postalCode;
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    var lat = '';
    var lng = '';
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      callback([lat, lng]);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

/**
 * Fills the distances array with objects storing gymid: value and distance: value pairs.
 * The method sortByDistance() is called once all gyms have been processed.
 * 
 * @param {function} pushToDistances code to execute once userLatLong and at least one gymLatLong 
 *                                   has been returned
 */
function getDistances(pushToDistances) {
  let userLatLong;
  getLatLongFromPostal(userPostalCode, function (data) {
    // This is executed once getLatLongFromPostal() gets results back from geocode() for user
    userLatLong = data;
    console.log("User lat/long: " + userLatLong);
    // NOW get gym lat long because pushToDistances() requires userLatLong to have value
    let i = 0;
    db.collection("gyms").get().then(function (snap) {
      snap.forEach(function (doc) { //cycle thru collection of all gyms
        let gymPostalCode = doc.data()["postal code"]; //get postal code of a gym
        let gymLatLong;
        getLatLongFromPostal(gymPostalCode, function (data) {
          gymLatLong = data;
          console.log("Gym lat/long: " + gymLatLong);
          pushToDistances(userLatLong, gymLatLong, doc);
          i++;
          if (i == 10) {
            // DISTANCES ARRAY HAS BEEN CREATED, CAN PROCEED WITH ANY FUNCTIONS THAT NEED DISTANCE
            console.log("Distances array created: ");
            console.log(distances);
            if (localStorage.getItem("filterList") === null) {
              localStorage.setItem("filterList", "");
            }
            if (localStorage.getItem("filterList").length > 0) {
              sortByFilters();
              let appliedFilters = JSON.parse(localStorage.getItem("filterList"));
              console.log(appliedFilters);
              document.getElementById("filters_applied").innerHTML = "Filters applied: " + appliedFilters;
            } else {
              sortByDistance();
            }
          }
        });
      });
    });
  });
}

/**
 * Calculates the distance between two long/lat coordinates using the haversine formula.
 * 
 * @param {number} lat1 
 * @param {number} long1 
 * @param {number} lat2 
 * @param {number} long2 
 * @returns distance in km
 */
function calcDistance(lat1, long1, lat2, long2) {
  let earthR = 6371; // Earth radius in km
  let latDif = degToRad(lat2 - lat1);
  let longDif = degToRad(long2 - long1);
  let a = Math.sin(latDif / 2) * Math.sin(latDif / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(longDif / 2) * Math.sin(longDif / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = earthR * c; // in km
  return distance;
}

/**
 * Converts degrees to radians.
 * 
 * @param {number} deg 
 * @returns radians
 */
function degToRad(deg) {
  return deg * Math.PI / 180;
}

// Prepares the distances array with a user postal code then executes getDistances()
function prepDistancesArray() {
  // Get user postal code from db or local storage based on sign in status
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      updateNavBar();
      db.collection("users").doc(user.uid)
        .get().then(function (snap) {
          userPostalCode = snap.data()["postal code"]; //get postal code of a user
          // console.log(userPostalCode);
          getDistances(function (userLatLong, gymLatLong, doc) {
            let d = calcDistance(userLatLong[0], userLatLong[1], gymLatLong[0], gymLatLong[1]);
            distances.push({
              gym_id: doc.id,
              distance: d
            });
          });
        })
    } else {
      // No user is signed in.
      document.getElementById("index_link").onclick = homeClick;
      userPostalCode = localStorage.getItem("postalCodeLocal");
      getDistances(function (userLatLong, gymLatLong, doc) {
        let d = calcDistance(userLatLong[0], userLatLong[1], gymLatLong[0], gymLatLong[1]);
        distances.push({
          gym_id: doc.id,
          distance: d
        });
      });
    }
  })
}

/**
 * Loads gym.html, showing the gym info corresponding to the one that was clicked.
 * 
 * @param c document id of the gym that was clicked
 */
function loadPage(c) {
  localStorage.setItem("Loaded Gym", c);
  window.location.href = "gym.html"
  //console.log(localStorage.getItem("Loaded Gym"));
}

// Updates the nav bar to reflect correct options for a signed in user
function updateNavBar() {
  let profile = document.getElementById("profile");
  profile.innerHTML = "Profile";
  profile.href = "profile.html";

  let logOut = document.getElementById("logout");
  logOut.innerHTML = "Log Out";
  logOut.href = "login.html";

  document.getElementById("index_link").onclick = homeClick;
}

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

//======================//
// Main                 //
//======================//
prepDistancesArray();
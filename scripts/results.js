//======================//
// Constants            //
//======================//
let dbRef = db.collection("gyms");

//======================//
// Global Variables     //
//======================//


let userPostalCode;
let userLatLong;
let distances = []; // array to store gym distances in

//======================//
// HTML DOM Elements    //
//======================//


//======================//
// Constructors         //
//======================//



//======================//
// Functions            //
//======================//

/** Sorts list by distance (closest to farthest) */
function sortByDistance(distance) {
  // distances contains an array with an object for each gym containing a gym: distance pair
  distances.sort(compare);
  console.log(distances);
  //displayCardsDist(distances);
}

/** Sorts list by price (lowest to highest) */
function sortByPrice() {
  dbRef.orderBy("price")
    .get()
    .then(function (snap) {
      displayCards(snap);
    })
}

/** displays the cards */
function displayCards(CardObjects) { //takes in collection
  CardObjects.forEach(function (doc) { //cycle thru collection
    createOneCard(doc); //create card for one recipe/gym
  })
}


// Creates a gym card 
function createOneCard(c) {
  var coldiv = document.createElement("div");
  coldiv.setAttribute("class", "col-md-3");

  var carddiv = document.createElement("div");
  carddiv.setAttribute("class", "card");

  var cardbodydiv = document.createElement("div");
  cardbodydiv.setAttribute("class", "card-body");

  // gym name
  var name = document.createElement("h4");
  name.setAttribute("class", "card-title");
  var text = document.createTextNode(c.data().name);
  name.appendChild(text);

  // the distance
  var distance = document.createElement("p");
  distance.setAttribute("class", "card-text");
  var text = document.createTextNode("Distance");  // TODO
  distance.appendChild(text);

  // the address
  var address = document.createElement("p");
  address.setAttribute("class", "card-text");
  var text = document.createTextNode(c.data().address);
  address.appendChild(text);

  // the drop-in price
  var price = document.createElement("p");
  price.setAttribute("class", "card-text");
  if (!isNaN(c.data().price)) {
    var text = document.createTextNode("Drop-in price: $" + c.data().price);
    price.appendChild(text);
  } else {
    var text = document.createTextNode("Drop-in price: " + c.data().price);
    price.appendChild(text);
  }

  // the occupancy
  var occupancy = document.createElement("p");
  occupancy.setAttribute("class", "card-text");
  var text = document.createTextNode("Occupancy: " + c.data().occupancy);
  occupancy.appendChild(text);

  // VIEW GYM button
  var a = document.createElement("input");
  a.type = "button"
  a.setAttribute("value", "View Gym");
  a.addEventListener('click', function () {
    loadPage(c.id);
  });
  a.setAttribute("class", "btn btn-outline-secondary");
  var text = document.createTextNode("View Gym");
  a.appendChild(text);

  // stitch it all together 
  cardbodydiv.appendChild(name);
  //cardbodydiv.appendChild(distance);
  cardbodydiv.appendChild(address);
  cardbodydiv.appendChild(price);
  cardbodydiv.appendChild(occupancy);
  cardbodydiv.appendChild(a);
  carddiv.appendChild(cardbodydiv);
  coldiv.appendChild(carddiv);
  document.getElementById("cards").appendChild(coldiv); //stick it in the div
}



// Function to load gym.html, passing the clicked gym info
function loadPage(c) {
  localStorage.setItem("Loaded Gym", c);
  window.location.href = "gym.html"
  //console.log(localStorage.getItem("Loaded Gym"));

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

// Gets the lat and long of a postal code
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

// Fills the distances array with objects storing gym: distance pairs
function getDistances(pushToDistances) {
  getLatLongFromPostal(userPostalCode, function (data) {
    userLatLong = data;
    console.log("User lat/long: " + userLatLong);
  });
  let i = 0;
  db.collection("gyms").get().then(function (snap) {
    snap.forEach(function (doc) { //cycle thru collection of all gyms
      let gymPostalCode = doc.data()["postal code"]; //get postal code of a gym
      let gymLatLong;
      getLatLongFromPostal(gymPostalCode, function (data) {
        gymLatLong = data;
        // console.log("Gym lat/long: " + gymLatLong);
        pushToDistances(userLatLong, gymLatLong, doc);
        i++;
        if (i == 9) {
          console.log(distances);
        }
      });
    });
  });
}

// Calculates the distance between two long/lat coordinates
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

// Converts degress to radians
function degToRad(deg) {
  return deg * Math.PI / 180;
}

// Comparison logic for sort() function
function compare(a, b) {
  if (a["distance"] > b["distance"]) {
    return 1;
  }
  if (a["distance"] < b["distance"]) {
    return -1;
  }
  return 0;
}

// Sorts the distances array from closest to furthest away from the user
function sortDistancesArray() {
  // Get user postal code from db or local storage based on sign in status
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      db.collection("users").doc(user.uid)
        .get().then(function (snap) {
          userPostalCode = snap.data()["postal code"]; //get postal code of a user
          console.log(userPostalCode);
          getDistances(function (userLatLong, gymLatLong, doc) {
            let d = calcDistance(userLatLong[0], userLatLong[1], gymLatLong[0], gymLatLong[1]);
            distances.push({
              gym_id: doc.id,
              distance: d
            });
            sortByDistance();
          });
        })
    } else {
      // No user is signed in.
      userPostalCode = localStorage.getItem("postal code");
      getDistances(function (userLatLong, gymLatLong, doc) {
        let d = calcDistance(userLatLong[0], userLatLong[1], gymLatLong[0], gymLatLong[1]);
        distances.push({
          gym_id: doc.id,
          distance: d
        });
        sortByDistance();
      });
    }
  })

}

// EXECUTION START
sortDistancesArray();
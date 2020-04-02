// EXECUTION START
sortDistancesArray();
// setTimeout(sortByDistance, 9000);
if(localStorage.getItem("filterList")== undefined){
  localStorage.setItem("filterList", []);
}
console.log(localStorage.getItem("filterList")[1]);
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
let idCounter = 0;
let distanceCardArray = [];

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
  document.getElementById("cards").innerHTML = '';
  // distances contains an array with an object for each gym containing a gym_id: value and distance: value
    dbRef.get().then(function (snap) {
      // Display a card for each document in the array
      displayCards(snap);
      let gymCardsList = Array.prototype.slice.call(document.getElementsByClassName("gymCard"));
      // console.log(gymCardsList.length);
      for (let i = 0; i < gymCardsList.length; i++) {
        gymCardsList[i] = gymCardsList[i].id;
      }
      // console.log(gymCardsList);
      gymCardsList.sort(function(a, b) {
        return a - b;
      });
      for (let i = 0; i < gymCardsList.length; i++) {
        let card = document.getElementById(gymCardsList[i]);
        document.getElementById("cards").appendChild(card); //stick it in the div
      }
    })

}
//compare arrays
let checker = (arr, target) => target.every(v => arr.includes(v));
/** Sorts list by price (lowest to highest) */
function sortByPrice() {
  document.getElementById("cards").innerHTML = '';
  if (localStorage.getItem("filterList").length == 0) {
    dbRef.orderBy("price")
      .get()
      .then(function (snap) {
        displayCards(snap);
      })
    
  } else {
    dbRef.get().then(function (doc) {
      doc.forEach(function (doc1) {
        console.log(doc1.id, checker(doc1.data().Filters, localStorage.getItem("filterList")));
      });
    });
  }
}

// function compareArray(arr1, arr2) {
  // let filteredArr = [];
  // for (let i = 0; i < arr1.length; i++) {
  //   for (let j = 0; j < arr2.length; j++) {
  //     if(arr1[i] == arr2[j]){

  //     }
  //   }
  // }
// }

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

  var distance = document.createElement("p");
  distance.setAttribute("class", "card-text");
  // Loops through each object in distances array
  for (let i = 0; i < distances.length; i++) {
    if (distances[i].gym_id === c.id) {
      // Object gym_id matches db document id
      var text = document.createTextNode(distances[i].distance.toFixed(2) + " km away");
      coldiv.setAttribute("id", distances[i].distance + "");
      coldiv.setAttribute("class", "gymCard col-md-3");
      break;
    }
  }
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
  cardbodydiv.appendChild(distance);
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

// Fills the distances array with objects storing gymid: value and distance: value pairs
function getDistances(pushToDistances) {
  getLatLongFromPostal(userPostalCode, function (data) {
    userLatLong = data;
    // console.log("User lat/long: " + userLatLong);
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
          // The distances array is created at this point, can proceed
          console.log("Distances array created: ");
          console.log(distances);
          sortByDistance();
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
      userPostalCode = localStorage.getItem("postalCodeLocal");
      getDistances(function (userLatLong, gymLatLong, doc) {
        let d = calcDistance(userLatLong[0], userLatLong[1], gymLatLong[0], gymLatLong[1]);
        distances.push({
          gym_id: doc.id,
          distance: d
        });
        // distances.sort(compare);
      });
    }
  })

}

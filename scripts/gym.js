

//======================//
// Global variables     //
//======================//
var gymID = localStorage.getItem("Loaded Gym");
console.log(gymID);
var docRef = db.collection("gyms").doc(gymID);

//======================//
// Functions            //
//======================//

/** Grabs gym based off of gymName that was passed to this page */
function grabGymById(id) {
    docRef.get().then(function(doc) {
        if (doc.exists) {
            createOneCard(doc);
            generateMap(doc);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
    
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

  var map = document.createElement("div");



  // stitch it all together 
  cardbodydiv.appendChild(name);
  //cardbodydiv.appendChild(distance);
  cardbodydiv.appendChild(address);
  cardbodydiv.appendChild(price);
  cardbodydiv.appendChild(occupancy);
  //cardbodydiv.appendChild(map);
  carddiv.appendChild(cardbodydiv);
  coldiv.appendChild(carddiv);
  document.getElementById("card").appendChild(coldiv); //stick it in the div
}

// generates google map 
function generateMap(c) {
    document.getElementById("gmap_canvas").src = c.data().map;
}

//======================//
// Main                 //
//======================//
grabGymById(gymID);

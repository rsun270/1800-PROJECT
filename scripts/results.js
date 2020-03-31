let dbRef = db.collection("gyms");


/** Sorts list by distance (closest to farthest) */
function grabByDistance(distance) {
    dbRef.orderBy("distance")
    .get()
    .then(function (snap) {
      displayCards(snap);
    })
}



/** Sorts list by price (lowest to highest) */
function sortByPrice() {
   dbRef.orderBy("price")
    .get()
    .then(function (snap) {
      displayCards(snap);
    })
}

function displayGym(gym, id) { //input json object, and a unique ID for the recipe
  var n = gym.name;
  console.log(n); //should print out name
  var para = document.createElement("div");
  para.setAttribute("id", id);
  document.body.appendChild(para);
  var node = document.createTextNode(n); //name is from firestore
  para.appendChild(node);
  $("#" + id).click(function () { //attach listener to each recipe
      alert("in handler!" + id + " was clicked!"); //for debug
      window.location.href = "gym.html" + id; //pass along ID of the recipe doc.
  })
}

function displayCards(CardObjects) {       //takes in collection
  CardObjects.forEach(function (doc) {   //cycle thru collection
          createOneCard(doc);            //create card for one recipe/gym
      })
}

function createOneCard(c) {
  var coldiv = document.createElement("div");
            coldiv.setAttribute("class", "col-md-3");

            var carddiv = document.createElement("div");
            carddiv.setAttribute("class", "card");

            var cardbodydiv = document.createElement("div");
            cardbodydiv.setAttribute("class", "card-body");

            var name = document.createElement("h4");
            name.setAttribute("class", "card-title");
            var text = document.createTextNode(c.data().name);
            name.appendChild(text);

            //var distance = document.createElement("p");
            //distance.setAttribute("class", "card-text");
            //var text = document.createTextNode(c.data().distance);
            //distance.appendChild(text);
            
            var address = document.createElement("p");
            address.setAttribute("class", "card-text");
            var text = document.createTextNode(c.data().address);
            address.appendChild(text);

            var price = document.createElement("p");
            price.setAttribute("class", "card-text");
            if (!isNaN(c.data().price)) {
              var text = document.createTextNode("Drop-in price: $" + c.data().price);
              price.appendChild(text);
            } else {
              var text = document.createTextNode("Drop-in price: " + c.data().price);
              price.appendChild(text);
            }

            var occupancy = document.createElement("p");
            occupancy.setAttribute("class", "card-text");
            var text = document.createTextNode("Occupancy: " + c.data().occupancy);
            occupancy.appendChild(text);

            var a = document.createElement("a");
            a.setAttribute("href", c.data().id + ".html");
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

// on home click
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

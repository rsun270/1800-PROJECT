function findByCode(postalcode) {    
    db.collection("gyms").get().then(function (snap) {
        snap.forEach(function (doc) { //cycle thru collection of all gyms
            var postalCode = doc.data().postal_code; //get location of a gym
            var d = calcDistance(x1, y1, x2, y2);
            if (d < dmin) {
                dmin = d;
                localStorage.setItem("closest", doc.data().name); //name of the closest gym
            }
        });
    });
    var closest = localStorage.getItem("closest"); //get closest
    console.log(closest);
    //displayGym(closest);
}

function getDistance() {

}


function getLongLatFromPostal(postalCode) {
    var geocoder = new google.maps.Geocoder();
    var lat = '';
    var lng = '';
    var address = postalCode;
    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         lat = results[0].geometry.location.lat();
         lng = results[0].geometry.location.lng();
        } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
    return [lat, lng];
}


function calcDistance(x1, y1, x2, y2) {
    return 10; // use pythagoras thm to cacluate distance between 2 points
}

getLongLatFromPostal("V5E1V1");

// MAPS API KEY
// AIzaSyCWLNBdT0HsvpDLqGjV5pqBONvtCIiM4p8
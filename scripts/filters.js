//======================//
// Global Variables     //
//======================//

var favorite = [];
var poolCheck = document.getElementById("pool");
var femaleOnlyCheck = document.getElementById("Female-Only");
var freeParkingCheck = document.getElementById("Free_parking");
var hoursCheck = document.getElementById("24/7");
var trainersCheck = document.getElementById("Trainers");
var multipleLocationCheck = document.getElementById("Multiple_locations");

//======================//
// Functions            //
//======================//

/** Adds selected filters into local storage. */
function addFilterList() {
    localStorage.setItem("filterList", JSON.stringify(favorite));
}

/** Check if pool filter has been selected. */
function checkPool() {
    if (poolCheck.checked && !favorite.includes('Pool')) {
        favorite.push(poolCheck.value);
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == poolCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}

/** Check if female gym filter has been selected. */
function checkFemaleOnly() {
    if (femaleOnlyCheck.checked && !favorite.includes('Female-Only')) {
        favorite.push(femaleOnlyCheck.value);
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == femaleOnlyCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}

/** Check if free parking filter has been selected. */
function checkFreeParking() {
    if (freeParkingCheck.checked && !favorite.includes('Free parking')) {
        favorite.push(freeParkingCheck.value);
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == freeParkingCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}

/** check if 24hours filters has been selected. */
function checkHours() {
    if (hoursCheck.checked && !favorite.includes('24/7')) {
        favorite.push(hoursCheck.value);
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == hoursCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}

/** check if trainers filter has been selected. */
function checkTrainers() {
    if (trainersCheck.checked && !favorite.includes('Trainers')) {
        favorite.push(trainersCheck.value);
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == trainersCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}

/** check if multiple locations filter has been selected */
function checkMultipleLocations() {
    if (multipleLocationCheck.checked && !favorite.includes('Multiple locations')) {
        favorite.push(multipleLocationCheck.value);;
    } else {
        for (let i = 0; i < favorite.length; i++) {
            if (favorite[i] == multipleLocationCheck.value) {
                favorite.splice(i, 1);
            }
        }
    }
}
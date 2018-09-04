
// Get the modal
var modal = document.getElementById('cost');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// open the map function
function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    

    //to make the center of the map the clients location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
}


function searchingLocation() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("locationSelection");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myLocations");
    li = ul.getElementsByTagName("li");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//_______________________Make Json Object from Users Input______________________________

//Insert To Database
function makeNewOutlay(){
    const sqlite3 = require('sqlite3').verbose();
    var amount = document.getElementById("amount").value;
    var type = document.getElementById("typeSelection").value;
    var date = document.getElementById("date").value;
    var description = document.getElementById("description").value;
    var userStatus = document.getElementById("userStatusSelection").value;
    var moodLevel = document.getElementById("moodLevelSelection").value;
    var weather = "NULL";
    var location = document.getElementById("locationSelection").value;
    var insertToTable = "INSERT INTO costs(amount, type, date, description, userStatus, moodLevel, weather, location) values(" +
                            "'" + amount + 
                            "', '" + type +
                            "', '" + date + 
                            "', '" + description + 
                            "', '" + userStatus + 
                            "', '" + moodLevel + 
                            "', '" + weather + 
                            "', '" + location + 
                            "')";

    // open database
    let db = new sqlite3.Database('./Database/costs.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the costs SQlite database.');
    });
        
    db.serialize(() => {
        db.each(insertToTable, (err, row) => {
            if (err) {
                console.error(err.message);
            }
        });
    });
    
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

//_________________________SELECT LOCATION__________________________
function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

//That is for making selections by the Json files
$.getJSON( "./../../serverSide/Json/columns.json", function( columns ) {
    columns.forEach(col => {
        var columnName = col;
        var path = "./../../serverSide/Json/" + columnName + ".json";
        $.getJSON( path, function( obj ) {
            var id = columnName + "Selection";
            obj.forEach(element => {
                var x = document.getElementById(id);
                if(id == "locationSelection"){
                    var c = document.createElement("option");
                    c.setAttribute("value", element);
                    x.appendChild(c);
                    console.log(element);
                }
                else if(x != null){
                    var c = document.createElement("option");
                    c.text = element;
                    c.value = element;
                    x.options.add(c, 1);
                    console.log(element);
                }
            });
        });
    });
    });
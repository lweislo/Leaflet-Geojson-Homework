// Creating map object
var myMap = L.map("map", {
  center: [-20, -178],
  zoom: 6
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
// Grab the data with d3

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(magnitude) {
  switch (magnitude) {
  case magnitude < 2:
    return "green";
  case magnitude >= 2:
    return "yellow";
  case magnitude >= 3:
    return "orange";
  case magnitude >= 4:
    return "red";
  case magnitude >= 5:
    return "purple";
  case magnitude >= 6:
    return "black";
  default:
    return "white";
  }
}

// Grabbing our GeoJSON data..
d3.json(url, function(response) {

  var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
  });

  for (var i = 0; i < response.features.length; i++) {
    var location = response.features[i].geometry;
    var time = new Date(parseInt(response.features[i].properties.time))

    console.log(time)
    if (location) {
      var point = L.marker([location.coordinates[1], location.coordinates[0]]);
      markers.addLayer(point)
      .bindPopup("<h4>Magnitude: " + response.features[i].properties.mag + " (" + response.features[i].properties.magType + ")</h4><hr><h5>" + response.features[i].properties.place + "</h5><h6>" + time + "</h6>");
    }
  }
  myMap.addLayer(markers);
});
    // for (var i = 0; i < response.features.length; i++) {
    //
    //   var location = response.features[i].geometry;
    //   if (location) {
    //     L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap).bindPopup(response.features[i].properties.title);
    //   }
    // }
    //
    // style: function(feature) {
    //   return {
    //     color: "white",
    //     fillColor: chooseColor(feature.properties.mag),
    //     fillOpacity: 0.75,
    //     weight: 1.5
    //   };
    // },
    // // Called on each feature
    // onEachFeature: function(feature, layer) {
    //   // Set mouse events to change map styling
    //   layer.on({
    //     // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
    //     mouseover: function(event) {
    //       layer = event.target;
    //       layer.setStyle({
    //         fillOpacity: 0.9
    //       });
    //     },
    //     // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
    //     mouseout: function(event) {
    //       layer = event.target;
    //       layer.setStyle({
    //         fillOpacity: 0.5
    //       });
    //     },
    //     // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
    //     click: function(event) {
    //       map.fitBounds(event.target.getBounds());
    //     }
    //   });
    //   // Giving each feature a pop-up with information pertinent to it
    //   layer.bindPopup("<h1>Magnitude: " + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
    //
    // }
  // }).addTo(map);
// });

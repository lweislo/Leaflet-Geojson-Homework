var myMap = L.map("map", {
  center: [-20, -178],
  zoom: 6
});
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Grabbing our GeoJSON data..
d3.json(url, function(data) {
  // Function to color the plot

  var geojsonMarkerOptions = {
         radius: 18,
         fillColor: "#0163FF",
         color: "#A9F6B2", //"#0163FF",
         weight: 2,
         opacity: 1,
         fillOpacity: 1,
         // className: 'marker-cluster'

       };

geoJson = new L.geoJson(data, {
    // Style each feature
    // style: function(feature) {
    //   return {
    //     color: "white",
    //     fillColor: chooseColor(feature.properties.mag),
    //     fillOpacity: 0.5,
    //     weight: 1.5
    //   };
    // },
    pointToLayer: function(feature, latlng) {
          return new L.circleMarker([latlng.lat, latlng.lng], geojsonMarkerOptions).bindPopup("<h4>Magnitude: " + feature.properties.mag + " (" + feature.properties.magType + ")</h4><hr><h5>" + feature.properties.place + "</h5><h6>" + Date(parseInt(feature.properties.time)) + "</h6>");
        },
    onEachFeature: function(feature, layer) {
      // feature.properties.mag = +feature.properties.mag
      // layer.bindPopup("<h4>Magnitude: " + feature.properties.mag + " (" + feature.properties.magType + ")</h4><hr><h5>" + feature.properties.place + "</h5><h6>" + Date(parseInt(feature.properties.time)) + "</h6>");
    }
  }).addTo(myMap);
});

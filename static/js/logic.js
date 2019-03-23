//Load a default map centered in Pacific Ocean
var myMap = L.map("map", {
  center: [-20, -128],
  zoom: 2
});

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};
//Color the circles based on magnitude
colors = ["#d8bc0d","#d86c0d","#e80000","#820000","#450051"]
function chooseColor(magnitude) {
    if (magnitude < 3) {
      return colors[0]
    }
    else if (magnitude >= 3 && magnitude <= 4){
      return colors[1]
    }
    else if (magnitude > 4 && magnitude <= 6) {
      return colors[2]
    }
    else if (magnitude > 6 && magnitude <= 7) {
      return colors[3]
    }
    else if (magnitude > 7) {
      return colors[4]
    }
  }
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
// Grabbing our GeoJSON data..
d3.json(url, function(data) {

  var quakes = new L.geoJson(data, {
    style: function(feature) {
      var magnitude = +feature.properties.mag;
      var depth = 1/Math.log10(+feature.geometry.coordinates[2]);
      if (depth < 0.1){
        depth = 0.2
      }
      else if (depth > 0.8) {
        depth = 0.9
      }
      return {
        color: "#fff",
        weight: 0.2,
        fillOpacity: depth,
        fillColor: chooseColor(magnitude),
        radius: (magnitude * magnitude)/4
      };
    },
    pointToLayer: function(feature, latlng) {
          return new L.circleMarker([latlng.lat, latlng.lng]).bindPopup("<h4>Magnitude: " + feature.properties.mag + " (" + feature.properties.magType + ")</h4><hr><h5>" + feature.properties.place + " <br />Depth: " + feature.geometry.coordinates[2] + "km.</h5><h5>" + Date(parseInt(feature.properties.time)) + "</h5>");
        },
  })
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 3, 4, 6, 7,"+"];
    var colors = colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h3>Earthquake Magnitude</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  // legend.addTo(myMap);
  // quakes.addTo(myMap);
  var overlayMaps = {
    "Earthquakes": quakes
  }

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

});

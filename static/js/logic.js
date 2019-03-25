function createMap(quakes) {
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

  var overlayMaps = {
    "Earthquakes": quakes
  }
//Load a default map centered in Pacific Ocean
  var myMap = L.map("map", {
    center: [-20, -128],
    zoom: 2,
    layers:[streetmap, quakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//Add the legend
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ['1','2','3', '4', '5', '6', '7', '7+'];
    var labels = [];
    // Add min & max
    var legendInfo = "<h3>Magnitudes</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + chooseColor(index + 1) + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

  d3.json('./static/data/PB2002_boundaries.json', faultLines);

  function faultLines(data) {
    var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.65
    };
    var myLayer = L.geoJSON(data, {style: myStyle}).bindPopup("Plate Boundary").addTo(myMap);
    };
}
//Color the circles based on magnitude

function chooseColor(magnitude) {
    return magnitude > 7 ? '#030068' :
           magnitude > 6  ? '#660647' :
           magnitude > 5  ? '#BD0026' :
           magnitude > 4  ? '#FC4E2A' :
           magnitude > 3   ? '#FD8D3C' :
           magnitude > 2   ? '#f4ff5e' :
           magnitude > 1   ? '#02ff20' :
                      '#02ff20';
}

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
// Grabbing our GeoJSON data..
d3.json(url, quakeMarkers);

function quakeMarkers(data) {

  var quakes = new L.geoJson(data, {
    style: function(feature) {
      var magnitude = +feature.properties.mag;
      var depth = +feature.geometry.coordinates[2];
      var fill = 0;
      if (depth <= 10){
        fill = 0.9
      }
      else if (depth > 10) {
        fill = 0.7
      }
      return {
        color: "#fff",
        weight: 0.2,
        fillOpacity: fill,
        fillColor: chooseColor(magnitude),
        radius: (magnitude * magnitude)/3
      };
    },
    pointToLayer: function(feature, latlng) {
          return new L.circleMarker([latlng.lat, latlng.lng]).bindPopup("<h4>Magnitude: " + feature.properties.mag + " (" + feature.properties.magType + ")</h4><hr><h5>" + feature.properties.place + " <br />Depth: " + feature.geometry.coordinates[2] + "km.</h5><h5>" + Date(parseInt(feature.properties.time)) + "</h5>");
        },
  });
  createMap(quakes);
};

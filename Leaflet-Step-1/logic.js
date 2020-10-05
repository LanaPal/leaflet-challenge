// 1. Create GeoJson Url variable for the earthquake data (provided)
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// 2. Obtain earthquake data and log for visibility
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
  console.log(data);
});

// 3 Give each feature a popup describing the place, time and magnitude of the earthquake
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
// 4 Define the size of the markers/circles, representing the magnitude intensity
function markerSize(magnitude) {
    return magnitude * 4;
}
// 5. Determine marker colour based on magnitude (more intense = darker colour)
function markerColor(magnitude) {
    if (magnitude > 5) {
      return "#8B0000"
      }
    else if (magnitude > 4) {
      return "#FF0000"
      }  
    else if (magnitude > 3) {
      return "#FF4500"
    }
    else if (magnitude > 2) {
      return "#FFA500"
    }  
    else if (magnitude > 1) {
      return "#FFD700"
    }  
    else {
      return "#FFFFE0"
    }
}
  // 6. Create a GeoJSON layer containing the features array on the earthquakeData object
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        color: markerColor(feature.properties.mag),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },    
    onEachFeature: onEachFeature
  });
  createMap(earthquakes);
}
function createMap(earthquakes) {

// 7.Define the satellite/basis layer
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

  // 8. Define a baseMaps object to hold the base layer
  const baseMaps = {
    "Satellite Map": satellitemap
  };
  
  // Create overlay object to hold the overlay - earthquake - layer
  var overlayMap = {
    Earthquakes: earthquakes
  };

  // 9. Create a map (US-centered)
  const myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // 10. Create a layer control containing the baseMaps + layer
  L.control.layers(baseMaps, overlayMap, {
    collapsed: false
  }).addTo(myMap);
}
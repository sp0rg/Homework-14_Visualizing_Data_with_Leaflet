
// setting up map layer variables for each map
// easy to add maps using this methond
// create new map layer, add name into array, add into baselayers

// used to create light layer
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{accessToken: API_KEY
});

// used to create dark layer
var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{accessToken: API_KEY
});

// used to create satellite layer
var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{accessToken: API_KEY
});

// used to create outdoor layer
var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{accessToken: API_KEY
});

// slapping into an array
var map = L.map("potatoMap", {
    center: [34.05, -118.24],
    zoom: 4,
    layers: [lightMap,darkMap,satMap,outdoorsMap]
});

lightMap.addTo(map);

// create base layers
var baseLayers = {
    Light:lightMap,
    Dark:darkMap,
    Satellite:satMap,
    Outdoors:outdoorsMap
};

// create overlay
// https://leafletjs.com/reference-1.4.0.html#layergroup
var usgsMonth = new L.LayerGroup();
var allMonth = new L.LayerGroup();

var overlayLayers = {
    "Significant Earthquakes 1Mo":usgsMonth,
    "All Earthquakes 1Mo":allMonth
};

L.control.layers(baseLayers,overlayLayers).addTo(map);

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

// Create initial layer
// Only significant events over the past month
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
function(data){
    function styleInfo(feature) {
        return {
          opacity: .5,
          fillOpacity: .5,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.4
        };
      }
    
      // Define the color of the marker based on the magnitude of the earthquake.
      function getColor(mag) {
        switch (true) {
            case mag >5:
                return "#FF00FF";
            case mag >4:
                return "#FFB6C1";
            case mag >3:
                return "#DAA520";
            case mag >2:
                return "#FFD700";
            case mag >1:
                return "#20B2AA";
            default:
                return "#87CEFA";
        }
    }
    
      // Magnitude marker radius
    
      function getRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 2.5;
      }
    
      // add GeoJSON to the map
      L.geoJson(data, {
        pointToLayer: function(features, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    
      }).addTo(usgsMonth);
    
      usgsMonth.addTo(map);
    
      // Setting up legend
      var legend = L.control({
        position: "bottomright"
      });
    
    
      legend.onAdd = function() {
        var div = L
          .DomUtil
          .create("div", "info legend");
    
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
          "#87CEFA",
          "#20B2AA",
          "#FFD700",
          "#DAA520",
          "#FFB6C1",
          "#FF00FF"
        ];
    
    
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
      // Add legend to map
      legend.addTo(map);
    
 
});

//experimental
// Adding a second layer to look at all activity
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
function(data){
    function styleInfo(feature) {
        return {
          opacity: .5,
          fillOpacity: .5,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.4
        };
      }
    
      // Define the color of the marker based on the magnitude of the earthquake.
      function getColor(mag) {
        switch (true) {
            case mag >5:
                return "#FF00FF";
            case mag >4:
                return "#FFB6C1";
            case mag >3:
                return "#DAA520";
            case mag >2:
                return "#FFD700";
            case mag >1:
                return "#20B2AA";
            default:
                return "#87CEFA";
        }
    }
    
      // Magnitude marker radius
    
      function getRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 2.5;
      }
    
      // add GeoJSON to the map
      L.geoJson(data, {
        pointToLayer: function(features, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    
      }).addTo(allMonth);
    
      allMonth.addTo(map);
    
    
 
});
// experimental
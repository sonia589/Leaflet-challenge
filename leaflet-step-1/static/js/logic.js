//Create map
var myMap = L.map("map", {
    center: [34.052, -118.2437],
    zoom: 5
  });

//Add tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//Store json url variables
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

//Grab geojson data using D3
    d3.json(url, function(earthquakeData) {
        console.log(earthquakeData)
       function styleMap(feature){
           return{
            stroke: false,
            fillOpacity: 0.75,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag),
            weight: 0.5
           }}
       

// Set marker size function
       function markerSize(mag){
           return mag*3
       }
//Set marker color function
function markerColor(mag) {
    if (mag>90) {
        return "#ADFF2F";
    } else if (mag >70) {
        return "#9ACD32";
    } else if (mag>50) {
        return "#FFFF00";
    } else if (mag>30) {
        return "#ffd700";
    } else if (mag>10) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
  }


L.geoJson(earthquakeData,{
    pointToLayer: function(feature, coordinates){
        return L.circleMarker(coordinates)
    },
    style: styleMap,
    onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude "+ feature.properties.mag+ "<br>Depth "+ feature.geometry.coordinates[2]+ "<br>Location "+feature.properties.place);
    }
}).addTo(myMap)

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["90+", "70-89", "50-69", "30-49", "10-29", "<10"]
  var colors = ["#ADFF2F","#9ACD32","#FFFF00","#ffd700","#FFA500","#FF0000"]
  var labels = [];

  // Add min & max
  var legendInfo = "<h3>Earthquake<br>Depth</h3>" +
    "<div class=\"labels\">" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style='background-color: " + colors[index] + "'>"+limits[index]+"</li><br>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);

});

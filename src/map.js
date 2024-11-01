let map;

const colors = {
  "Kasaragod": "#ffefac",
  "Kannur": "#ffefac",
  "Kozhikode": "#ffefac",
  "Wayanad": "#ffefac",
  "Malappuram": "#ffacac",
  "Palakkad": "#ffacac",
  "Thrissur": "#ffacac",
  "Ernakulam": "#ffacac",
  "Idukki": "#abefff",
  "Alappuzha": "#abefff",
  "Kottayam": "#abefff",
  "Pathanamthitta": "#abefff",
  "Kollam": "#abefff",
  "Thiruvananthapuram": "#abefff"
}

fetch("kerala.geojson")
  .then(response => response.json())
  .then(json => {
    map = L.map('map', {zoomSnap: 0.1, zoomControl: true}).setView([10.8505, 76.2711], 10);
    
    // To show the map background:
    // var osm = new L.TileLayer.BoundaryCanvas("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   maxZoom: 19,
    //   boundary: json,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OSM Contributors</a>'
    // });
    // map.addLayer(osm)

    const layer = L.geoJSON(json, {
      style: function(feature) {
        return {
          fillColor: colors[feature.properties.name],
          fillOpacity: 0.5,
          color: "#000",
          weight: 0.2,
        }
      },
      pointToLayer: function (feature, latlng) {
        return;
      }
    });

    map.addLayer(layer)
    map.fitBounds(layer.getBounds());
  })

let markers = []
window.drawPoints = data => {
  markers.map(marker => map.removeLayer(marker))
  markers = []
  document.getElementById("example").innerHTML = ""

  data.forEach((item, index) => {
    if (index < 5) {
      const li = document.createElement("li")
      li.innerText = item[0]
      document.getElementById("example").appendChild(li)
    }
    const marker = L.circle([item[1], item[2]], {weight: 1, color: "red", fillColor: "red", radius: 10, fillOpacity: 1}).addTo(map)

    marker.bindPopup(item[0], {autoClose: false});
    markers.push(marker)
  })
} 

document.querySelector("#showPopups").addEventListener("click", e => {
  if (e.target.checked) {
    markers.map(marker => marker.openPopup())
  } else {
    markers.map(marker => marker.closePopup())
  }
})

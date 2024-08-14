mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// since this was giving a error label in show.ejs we are skipping this for now, will come back to it later:
const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(coordinates) //Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML("<p> Exact location provided after booking</p>")) // add popup
.addTo(map);
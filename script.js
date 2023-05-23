//access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA'; //ADD YOUR ACCESS TOKEN HERE


//initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/dark-v11", // custom Mapbox Studio style URL
    center: [-98.61328125, 52.05249047600099], // starting center in [lng, lat]
    zoom: 4,
});

fetch('https://raw.githubusercontent.com/ananmaysharan/rki-demo/main/cma.geojson')
.then(response => response.json())
.then(response => {
    console.log(response); //Check response in console
    cmageosjon = response; // Store geojson as variable using URL from fetch response
});

map.on('load', () => {

    map.addSource('cma', {
        type: 'geojson',
        data: cmageosjon,
    });

    map.addLayer({
        'id': 'cma-fill',
        'type': 'fill',
        'source': 'cma',
        'paint': {
            'fill-color': '#004285', // blue color fill
            'fill-opacity': 1
        },
        'source-layer': 'cma-4lggi2',
    });
});
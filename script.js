//access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA'; //ADD YOUR ACCESS TOKEN HERE


//initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // custom Mapbox Studio style URL
    center: [-93.91328125, 62.05249047600099], // starting center in [lng, lat]
    zoom: 3,
    attributionControl: false
});

// Controls 

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Canadian Urban Institute'
}));

// Add the control to the map.

   const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: 'ca',
    types: 'place',
    language: 'en',
    marker: false,
    zoom: 4
    })

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', () => {

    map.addSource('mainstreets', {
        'type': 'vector',
        'url': 'mapbox://ananmay.3x6p7vfl'
    });

    map.addLayer({
        'id': 'mainstreets',
        'type': 'line',
        'source': 'mainstreets',
        'paint': {
            'line-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'Bsnss_t'], // GET expression retrieves property value from 'Bsnss_t' data field
                '#000', // Colour assigned to any values < first step
                5, '#000033', // Colours assigned to values >= each step
                9.2, '#50127b',
                15.5, '#b6377a',
                26.7, '#fb8761',
                52.5, '#fcfdbf'
            ],
            'line-width': 1,
            // 'line-opacity': [
            //     "interpolate",
            //     ["linear"],
            //     ["zoom"],
            //     7, 1,  // Opacity 1 at zoom level 10
            //     15, 0.4   // Opacity 0 at zoom level 15
            //   ]
        },
        'source-layer': 'mainstreets-6sme9h',
        // 'minzoom': 7
    });

    map.addSource('provinces', {
        'type': 'vector',
        'url': 'mapbox://ananmay.6koz5u8g'
    });

    map.addLayer({
        'id': 'provinces-fill',
        'type': 'fill',
        'source': 'provinces',
        'paint': {
            'fill-color': '#EB1414', // blue color fill
            'fill-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                3, 0.6,  // Opacity 1 at zoom level 10
                6, 0   // Opacity 0 at zoom level 15
              ],
        },
        'source-layer': 'canada-provinces-0zchsz'
    });

    /* -------------------------------------------------------------------------- */
    /*                                 Old Layers                                 */
    /* -------------------------------------------------------------------------- */
    map.addSource('westqueenwest', {
        'type': 'vector',
        'url': 'mapbox://ananmay.9eb599ys'
    });

    map.addLayer({
        'id': 'westqueenwest-fill',
        'type': 'fill',
        'source': 'westqueenwest',
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0.8,  // Opacity 1 at zoom level 10
                14, 0   // Opacity 0 at zoom level 15
              ],
        },
        'source-layer': 'westqueenwest_bia-2ia623'
    }, 'mainstreets');


    map.addLayer({
        'id': 'westqueenwest-line',
        'type': 'line',
        'source': 'westqueenwest',
        'paint': {
            'line-color': '#fff', // blue color fill
            'line-width': 2,

        },
        'source-layer': 'westqueenwest_bia-2ia623'
    }, 'mainstreets');

    map.addSource('westqueenwest-isochrone', {
        'type': 'vector',
        'url': 'mapbox://ananmay.85qqkkbl'
    });

    map.addLayer({
        'id': 'westqueenwest-isochrone',
        'type': 'fill',
        'source': 'westqueenwest-isochrone',
        'paint': {
            'fill-color': '#2954A3', // blue color fill
            'fill-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 0.5   // Opacity 0 at zoom level 15
              ],
        },
        'source-layer': 'WestQueenWest_Walking-7g4sei'
    }, 'mainstreets');

    map.addSource('parks', {
        'type': 'vector',
        'url': 'mapbox://ananmay.b6djvwy3'
    });

    map.addLayer({
        'id': 'parks',
        'type': 'fill',
        'source': 'parks',
        'paint': {
            'fill-color': '#26841F', // green color fill
            'fill-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 0.5   // Opacity 0 at zoom level 15
              ],
        },
        'source-layer': 'Parks-2dtlu8'
    });

    map.addSource('civicinfra', {
        'type': 'vector',
        'url': 'mapbox://ananmay.axrxo2tc'
    });

    map.addLayer({
        'id': 'artsandculture',
        'type': 'circle',
        'source': 'civicinfra',
        'source-layer': 'civicinfra-38qs0v',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#8A6189',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ],
            'circle-stroke-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ]
        },
        'layout': {
            'visibility': 'visible'
        },
        'filter': ["all", ["==", "Group", 'Arts and Culture']],
        'minzoom': 12
    });

    map.addLayer({
        'id': 'education',
        'type': 'circle',
        'source': 'civicinfra',
        'source-layer': 'civicinfra-38qs0v',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#9C320D',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ],
              'circle-stroke-opacity': [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 0,  // Opacity 1 at zoom level 10
                  14, 1   // Opacity 0 at zoom level 15
                ]
        },
        'layout': {
            'visibility': 'visible'
        },
        'filter': ["all", ["==", "Group", 'Education']],
        'minzoom': 12
    });

    map.addLayer({
        'id': 'govtcommunityservices',
        'type': 'circle',
        'source': 'civicinfra',
        'source-layer': 'civicinfra-38qs0v',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#B1962B',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ],
              'circle-stroke-opacity': [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 0,  // Opacity 1 at zoom level 10
                  14, 1   // Opacity 0 at zoom level 15
                ]
        },
        'layout': {
            'visibility': 'visible'
        },
        'filter': ["all", ["==", "Group", 'Government and Community Services']],
        'minzoom': 12
    });


    map.addLayer({
        'id': 'healthandcarefacilities',
        'type': 'circle',
        'source': 'civicinfra',
        'source-layer': 'civicinfra-38qs0v',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#1B9AC2',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ],
              'circle-stroke-opacity': [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 0,  // Opacity 1 at zoom level 10
                  14, 1   // Opacity 0 at zoom level 15
                ]
        },
        'layout': {
            'visibility': 'visible'
        },
        'filter': ["all", ["==", "Group", 'Health and Care Facilities']],
        'minzoom': 12
    });

    map.addLayer({
        'id': 'recreation',
        'type': 'circle',
        'source': 'civicinfra',
        'source-layer': 'civicinfra-38qs0v',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#055E58',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                12, 0,  // Opacity 1 at zoom level 10
                14, 1   // Opacity 0 at zoom level 15
              ],
              'circle-stroke-opacity': [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  12, 0,  // Opacity 1 at zoom level 10
                  14, 1   // Opacity 0 at zoom level 15
                ]
        },
        'layout': {
            'visibility': 'visible'
        },
        'filter': ["all", ["==", "Group", 'Recreation Facilities']],
        'minzoom': 12
    });

    // 3d Test

    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            //'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            // 'minzoom': 12,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6
            },
            'layout': {
                'visibility': 'none'
            }
        });
      

});





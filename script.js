//access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA'; //ADD YOUR ACCESS TOKEN HERE


//initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/dark-v11", // custom Mapbox Studio style URL
    center: [-93.91328125, 52.05249047600099], // starting center in [lng, lat]
    zoom: 3,
    attributionControl: false
});

// Controls 

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Canadian Urban Institute'
}));

// Add the control to the map.
map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: 'ca',
    types: 'place',
    language: 'en',
    marker: false,
    zoom: 4
    }), 'top-left'
    );

let cmageojson;

fetch('https://raw.githubusercontent.com/ananmaysharan/rki-demo/main/cma.geojson')
    .then(response => response.json())
    .then(response => {
        //console.log(response); //Check response in console
        cmageojson = response; // Store geojson as variable using URL from fetch response
    });


map.on('load', () => {

    map.addSource('cma', {
        type: 'geojson',
        data: cmageojson
    });

    map.addLayer({
        'id': 'cma-fill',
        'type': 'fill',
        'source': 'cma',
        'paint': {
            'fill-color': '#EA1321', // blue color fill
            'fill-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                4, 0.4,  // Opacity 1 at zoom level 10
                7, 0   // Opacity 0 at zoom level 15
              ]
        }
    });

    map.addLayer({
        'id': 'cma-outline',
        'type': 'line',
        'source': 'cma',
        'paint': {
            'line-color': '#000004',
            'line-width': 2,
            'line-opacity': 0.4
        }
    });

    map.addSource('mainstreets-to', {
        'type': 'vector',
        'url': 'mapbox://ananmay.6h5lfuq8'
    });

    map.addLayer({
        'id': 'mainstreets-to',
        'type': 'line',
        'source': 'mainstreets-to',
        'paint': {
            'line-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'Bsnss_t'], // GET expression retrieves property value from 'Bsnss_t' data field
                '#000', // Colour assigned to any values < first step
                10, '#000033', // Colours assigned to values >= each step
                15.9, '#50127b',
                23.8, '#b6377a',
                41.6, '#fb8761',
                75.2, '#fcfdbf'
            ],
            'line-width': 1,
            'line-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                7, 1,  // Opacity 1 at zoom level 10
                15, 0.4   // Opacity 0 at zoom level 15
              ]
        },
        'source-layer': 'mainstreets_to-copw1v',
        'minzoom': 7
    });

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
    }, 'mainstreets-to');


    map.addLayer({
        'id': 'westqueenwest-line',
        'type': 'line',
        'source': 'westqueenwest',
        'paint': {
            'line-color': '#fff', // blue color fill
            'line-width': 2,

        },
        'source-layer': 'westqueenwest_bia-2ia623'
    }, 'mainstreets-to');

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
    }, 'mainstreets-to');

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
        'filter': ["all", ["==", "Group", 'Arts and Culture']]
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
        'filter': ["all", ["==", "Group", 'Education']]
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
        'filter': ["all", ["==", "Group", 'Government and Community Services']]
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
        'filter': ["all", ["==", "Group", 'Health and Care Facilities']]
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
        'filter': ["all", ["==", "Group", 'Recreation Facilities']]
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


    map.moveLayer('westqueenwest-line');


    /* -------------------------------------------------------------------------- */
    /*                                    Popup                                   */
    /* -------------------------------------------------------------------------- */

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'cma-fill', (e) => {
        if (map.getZoom() < 10) {
        map.getCanvas().style.cursor = 'pointer';
        popup
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.CMANAME)
            .addTo(map);
        }
    });

    // Change the cursor back to a pointer
    // when it leaves the layer.
    map.on('mouseleave', 'cma-fill', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('mouseenter', 'westqueenwest-fill', (e) => {
        if (map.getZoom() > 7) {
        map.getCanvas().style.cursor = 'pointer';
        popup
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.AREA_NAME)
            .addTo(map);
        }
    });

    // Change the cursor back to a pointer
    // when it leaves the layer.
    map.on('mouseleave', 'westqueenwest-fill', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('click', 'cma-fill', function (e) {
        const clickedFeature = e.features[0];
        const geometry = clickedFeature.geometry;
        const turfFeature = turf.feature(geometry);
        const bbox = turf.bbox(turfFeature);
        const bounds = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
        ];
        map.fitBounds(bounds, { padding: 50 });
        map.setPaintProperty('cma-outline', 'line-opacity', 0.3);
        const title = document.getElementById("title");
        // Set the HTML content of the h5 element to the area name
        title.innerHTML = clickedFeature.properties.CMANAME;
        console.log(title)

        document.getElementById("mainstreetdropdown").style.display = "block";
        document.getElementById("mainstreetlist").style.display = "block";


        
        // // Draw the rectangle
        // if (map.getLayer('bbox-rectangle')) {
        //     map.removeLayer('bbox-rectangle');
        // }
        // if (map.getSource('bbox-rectangle')) {
        //     map.removeSource('bbox-rectangle');
        // }

        // map.addSource('bbox-rectangle', {
        //     type: 'geojson',
        //     data: {
        //         type: 'Feature',
        //         geometry: {
        //             type: 'Polygon',
        //             coordinates: [[
        //                 [bbox[0], bbox[1]],
        //                 [bbox[0], bbox[3]],
        //                 [bbox[2], bbox[3]],
        //                 [bbox[2], bbox[1]],
        //                 [bbox[0], bbox[1]]
        //             ]]
        //         }
        //     }
        // });

        // map.addLayer({
        //     id: 'bbox-rectangle',
        //     type: 'fill',
        //     source: 'bbox-rectangle',
        //     paint: {
        //         'fill-color': '#ff0000',
        //         'fill-opacity': 0.5
        //     }
        // });


    });

    map.on('click', 'westqueenwest-fill', function (e) {
        const clickedFeature = e.features[0];
        const geometry = clickedFeature.geometry;
        const turfFeature = turf.feature(geometry);
        const bbox = turf.bbox(turfFeature);
        const bounds = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
        ];
        map.fitBounds(bounds, { padding: 50 });
        // map.setPaintProperty('cma-fill', 'fill-opacity', 0);
        // map.setPaintProperty('cma-outline', 'line-opacity', 0.3);
        map.getCanvas().style.cursor = 'pointer';

        const title = document.getElementById("title");
        // Set the HTML content of the h5 element to the area name
        title.innerHTML = clickedFeature.properties.AREA_NAME;

        document.getElementById("mainstreetdropdown").style.display = "none";
        document.getElementById("mainstreetlist").style.display = "none";
        document.getElementById("mainstreetaccordion").style.display = "block";


    });

    document.getElementById("westqueenwest-link").addEventListener("click", function (e) {
        const features = map.queryRenderedFeatures({ layers: ['westqueenwest-fill'] });
        console.log(features)
        const clickedFeature = features[0];
        const geometry = clickedFeature.geometry;
        const turfFeature = turf.feature(geometry);
        const bbox = turf.bbox(turfFeature);
        const bounds = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
        ];
        map.fitBounds(bounds, { padding: 50 });
    
        const title = document.getElementById("title");
        // Set the HTML content of the h5 element to the area name
        title.innerHTML = clickedFeature.properties.AREA_NAME;
    
        document.getElementById("mainstreetdropdown").style.display = "none";
        document.getElementById("mainstreetlist").style.display = "none";
        document.getElementById("mainstreetaccordion").style.display = "block";
    });
      



map.on('data', function(e) {
    if (e.sourceId === 'mainstreets-to' && e.isSourceLoaded) {
      const features = map.querySourceFeatures('mainstreets-to', { sourceLayer: 'mainstreets_to-copw1v' });
      const values = features.map(feature => feature.properties.Bsnss_t);
      const geoSeries = new geostats(values);
      const quantiles = geoSeries.getClassQuantile(4);
      //console.log(values);
      console.log(quantiles);
    }
  });

//   function updateZoomLevel() {
//   currentzoom = map.getZoom();
//   const zoom = document.getElementById("zoom");
//         // Set the HTML content of the h5 element to the area name
//     zoom.innerHTML = currentzoom;
//   }

//   updateZoomLevel();

// // Add an event listener to update the zoom level when it changes
// map.on("zoomend", updateZoomLevel);

});


// Checkbox Interactivity

// Get all the checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Iterate over the checkboxes
checkboxes.forEach(function (checkbox) {
    // Add an event listener for each checkbox
    checkbox.addEventListener('change', function () {
        const layerId = this.parentNode.id; // Get the id of the list item
        const layer = map.getLayer(layerId); // Get the layer with the same id as the list item

        // If the checkbox is checked, show the layer; otherwise, hide it
        if (this.checked) {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    });
});



//Declare arrayy variables for labels and colours
const legendlabels = [
    '10 - 15.9',
    '15.9 - 23.8',
    '23.8 - 41.6',
    '41.6 - 75.2',
    '75 - 1220.2',
];

const legendcolours = [
    '#000033',
    '#50127b',
    '#b6377a',
    '#fb8761',
    '#fcfdbf'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});

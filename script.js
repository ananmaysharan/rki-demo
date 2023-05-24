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



});
//access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA'; //ADD YOUR ACCESS TOKEN HERE


//initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // custom Mapbox Studio style URL
    center: [-93.91328125, 52.05249047600099], // starting center in [lng, lat]
    zoom: 4,
    attributionControl:false
});

// Controls 

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Canadian Urban Institute'
}));


let cmageojson;

fetch('https://raw.githubusercontent.com/ananmaysharan/rki-demo/main/cma.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
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
            'fill-opacity': 0.4
        },
    });

    map.addLayer({
        'id': 'cma-outline',
        'type': 'line',
        'source': 'cma',
        'paint': {
        'line-color': '#410408',
        'line-width': 2
        }
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });

        map.on('mouseenter', 'cma-fill', (e) => {
            map.getCanvas().style.cursor = 'pointer';   

            popup
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.CMANAME)
            .addTo(map);
            });
            
          
            // Change the cursor back to a pointer
            // when it leaves the states layer.
            map.on('mouseleave', 'cma-fill', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
            });

            map.on('click', 'cma-fill', function(e) {
                map.setPaintProperty('cma-fill', 'fill-opacity', 0);
                var clickedFeature = e.features[0];
                var geometry = clickedFeature.geometry;

                var turfFeature = turf.feature(geometry);
                
                var bbox = turf.bbox(turfFeature);

                const bounds = [
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[3]]
                ];
                map.fitBounds(bounds, { padding: 50 });
              });
});



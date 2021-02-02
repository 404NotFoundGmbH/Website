let ws = new WebSocket("ws://localhost:4567/websocket/echo");
ws.onopen = function (event) {
    console.log(event);

    //ws.send(JSON.stringify("Websocket connection successful"));
}

ws.onclose = function (event) {
    console.log(event);
}

ws.onmessage = function (message) {
    console.log("Message got(unpparsed): " + message.data);
    let array = JSON.parse(message.data);
    console.log("Message got: " + array);
    if (message.data.toString().charCodeAt(0) === 91){
        drawLine(array);
    }else{
        printDistance(array);
    }

}

// 1. Create the button
let button = document.createElement("button");
button.innerHTML = "Transfer points";

// 2. Append somewhere
let body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
    console.log("Points to be sent: " + points);
    ws.send(JSON.stringify(points));
});

var elem2 = document.createElement('label');
elem2.innerHTML = "something";
document.getElementsByTagName('body')[0].appendChild(elem2);

mapboxgl.accessToken =
    "pk.eyJ1Ijoic2lsYXNkZW1leiIsImEiOiJja2pzbHV0enkyNjN6Mnl0ZmhzMXZpdDB1In0.dYyuFMBeqUYo8U7z95DGfQ";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [11.645390692998262, 46.7196204501802],
    zoom: 7
});

let points = [];

map.on("click", function(e) {
    // The event object (e) contains information like the
    // coordinates of the point on the map that was clicked.
    var marker = new mapboxgl.Marker({color:'#FF0000'})
        .setLngLat(e.lngLat)
        .addTo(map);
    console.log("A click event has occurred at " + e.lngLat);
    points.push(e.lngLat.lng);
    points.push(e.lngLat.lat);

});

function drawLine(array){
    let points_lng = [];
    let points_lat = [];
    let e=0;
    let sorted_points = [];

    //console.log("Array length: " + array.length);
    // Loop to create 2D array using 1D array
    for (let i = 0; i < (array.length)/2 + 1; i++) {
        sorted_points[i] = [];
    }

    for (let i=0; i<(array.length); i++){
        //console.log("i: " + i);
        //console.log(array[i]);
        //console.log(array[i+1]);
        points_lng.push(array[i]);
        points_lat.push(array[i+1]);

        i++;
    }

    points_lng.push(array[0]);
    points_lat.push(array[1]);
    //console.log("Points_lng length: " + points_lng.length);

    for (let i=0; i<(points_lng.length); i++){
        sorted_points[i][e] = points_lng[i];
        sorted_points[i][e+1] = points_lat[i];
    }
/*
    console.log("Points_lng: " + points_lng);
    console.log("Points_lat: " + points_lat);
    console.log("Points: " + sorted_points);
    console.log("Points at index 0: " + sorted_points[0]);
    console.log("Points at index 0,0: " + sorted_points[0][0]);
    console.log("Points at index 0,1: " + sorted_points[0][1]);
*/

    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates':  sorted_points
            }
        }
    });

    map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 8
            }
    });
}

function printDistance(data){
    document.getElementById('label1').innerHTML = 'Distance: ' + data;
}


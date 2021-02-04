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
    //if (message.data.toString().charCodeAt(0) === 91){
        drawLine(array);
    //}else{
        printDistance(array);
    //}

}
function convexButton(){
    console.log("Points to be sent: " + points);
    let str = JSON.stringify(points);
    ws.send(str + "1");
}

function  nearestButton(){
    console.log("Points to be sent: " + points);
    let str = JSON.stringify(points);
    ws.send(str + "2");
}

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

    //points_lng.push(array[0]);
    //points_lat.push(array[1]);
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

function printDistance(array){
    let lon = [];
    let lat = [];
    let distance = 0;

    console.log("Arraay length: " + array.length);

    for (let i=0;i<array.length;i++){
        if (i%2 == 0){
            lon.push(array[i]);
            lat.push(array[i+1]);
        }
    }


    for (let i=0;i<array.length-3;i++){
        if (i%2 == 0){
            console.log("Calculating distance from:\n x: " + array[i] + "\n y: " + array[i+1] + "\n\n x: " + array[i+2] + "\n y: " + array[i+3]);
            distance+= haversineDistance(array[i],array[i+1],array[i+2],array[i+3]);
            console.log("Distance: " + distance);
        }
    }

    document.getElementById("distance").innerHTML = "Distance: " + distance;
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

// haversine distance calculates distance between coordinates with earth rounding included
function haversineDistance(lon1,lat1,lon2,lat2) {

    var R = 6371; // km
//has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = x1.toRad();
    var x2 = lon2-lon1;
    var dLon = x2.toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}

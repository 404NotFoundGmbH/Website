let ws = new WebSocket("ws://localhost:4567/websocket/echo");
ws.onopen = function (event) {
    console.log(event);

    //ws.send(JSON.stringify("Websocket connection successful"));
}

ws.onclose = function (event) {
    console.log(event);
}

ws.onmessage = function (message) {
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

function stringifyArrayPoints(string) {
    let array = [];
    array.push(parseFloat(string.slice(string.indexOf(",")+1, -1)));
    array.push(parseFloat(string.slice(1, string.indexOf(",")-1)));
    return array;
}
/*
map.on('load', function () {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [11.799199286749342,46.51020570483951],
                    [11.387211982061672,46.37014590609408],
                    [11.980473700811558,46.241124839690315],
                    [11.832158271124456,45.97071780704849],
                    [-122.48404026031496, 37.83114119107971],
                    [-122.48404026031496, 37.83049717427869],
                    [-122.48348236083984, 37.829920943955045],
                    [-122.48356819152832, 37.82954808664175],
                    [-122.48507022857666, 37.82944639795659],
                    [-122.48610019683838, 37.82880236636284],
                    [-122.48695850372314, 37.82931081282506],
                    [-122.48700141906738, 37.83080223556934],
                    [-122.48751640319824, 37.83168351665737],
                    [-122.48803138732912, 37.832158048267786],
                    [-122.48888969421387, 37.83297152392784],
                    [-122.48987674713133, 37.83263257682617],
                    [-122.49043464660643, 37.832937629287755],
                    [-122.49125003814696, 37.832429207817725],
                    [-122.49163627624512, 37.832564787218985],
                    [-122.49223709106445, 37.83337825839438],
                    [-122.49378204345702, 37.83368330777276]
                ]
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
});
*/

function printDistance(data){
    let label = document.createElement("Label");
    label.innerText = "Test"
}

/*
// Sends POST request to server with adjazenzmatrix
function requestServer(matrix) {
    if(getSelectedAlgorithm() === 'ch'){
        matrix = getSelectedAlgorithm() + JSON.stringify(points);
    }else{
        matrix = getSelectedAlgorithm() + matrix;
    }
    console.log(matrix);
    const url = '/matrix';
    fetch(url, {
        method: 'POST',
        body: matrix,
    })  .then(response => response.text())
        .then(response => {
            // Splits toString() of Cities object and get data
            console.log(response);
            let cityArray;
            let lengthString = response;
            if(getSelectedAlgorithm() === 'ch'){
                // Special pasing for Convex hull because it returns coordinates
                response = response.slice(response.indexOf("sortedCities=[") + 14);
                cityArray = response.split("City{cityName=");
                for(let i = 0; i < cityArray.length; i++){
                    cityArray[i] = cityArray[i].slice(0, cityArray[i].indexOf(',', cityArray[i].indexOf(',', 0) + 2))
                    cityArray[i] = cityArray[i].slice(1, cityArray[i].length-1);
                }
                cityArray.shift();
            }else{
                // Parse all other algorithm results and get id
                response = response.slice(response.indexOf("sortedCities=[") + 14);
                cityArray = response.split("City{cityName=");
                for(let i = 0; i < cityArray.length; i++) {
                    if(cityArray[i].length === 0) {
                        cityArray.shift();
                        i--;
                    }else {
                        cityArray[i] = cityArray[i].slice(1, cityArray[i].indexOf("'", 1));
                    }
                }
            }
            // Get distance from result
            lengthString = lengthString.slice(lengthString.indexOf("Cities{distance=") + 16, lengthString.indexOf(","));
            var lengthFloat = parseFloat(lengthString).toFixed(2)
            onClickPositionView.innerHTML = "Length of the route: " + lengthFloat + " km";
            // Print lines on map
            printLines(cityArray);
        });
}
 */

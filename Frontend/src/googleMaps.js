var map;
var marker;
var directionsDisplay;
var homeMarker;

//щоб іконки нормально центрувались
var image = new google.maps.MarkerImage("assets/images/map-icon.png",new google.maps.Size(50,50),new google.maps.Point(0,0),new google.maps.Point(25,25));
var imageHome = new google.maps.MarkerImage("assets/images/home-icon.png",new google.maps.Size(50,50),new google.maps.Point(0,0),new google.maps.Point(25,25));

function initialize() {
//Тут починаємо працювати з картою

    directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers : true // не использовать маркеры
    });

    var mapProp = {
        center: new google.maps.LatLng(50.464379,30.519131),
        zoom: 13
    };
    var html_element = document.getElementById("myMap");
    map = new google.maps.Map(html_element, mapProp);
    //Карта створена і показана
    homeMarker = new google.maps.Marker({
        position: new google.maps.LatLng(50.464379,30.519131),
        map: map,
        title: "pizza;)",
        icon: imageHome
    });
    directionsDisplay.setMap(map);

    google.maps.event.addListener(map, 'click',function(me){

        var coordinates = me.latLng;

        geocodeLatLng(coordinates, function(err, adress){
            if(!err) {
                //Дізналися адресу
                //console.log(adress);
                document.getElementById('inputAddress').value = adress;
                $(document.getElementById('addressOfDestination')).text(adress);
                // console.log("A: "+homeMarker.getPosition()+"; B: "+coordinates);
                calculateRoute(homeMarker.getPosition(),coordinates, function(err,res){
                    //console.log("time = "+Math.ceil(res.duration.value/60)+" хв");
                    if(!err)$(document.getElementById('timeOfWaiting')).text(Math.ceil(res.duration.value/60)+" хв");
                });

            } else {
                console.log("Немає адреси");
                document.getElementById('inputAddress').value = "";
            }
        })
    });

    var geocoder;
    geocoder = new google.maps.Geocoder();

    $('#inputAddress').keyup(function(){
        var address = $('#inputAddress').val();
        geocoder.geocode( { 'address': address}, function(results, status) {
            // console.log(results[0].geometry.location);
            if (status == 'OK') {
                calculateRoute(homeMarker.getPosition(),results[0].geometry.location,function(err,res){
                    //console.log("time = "+Math.ceil(res.duration.value/60)+" хв");
                    if(!err){
                        $(document.getElementById('timeOfWaiting')).text(Math.ceil(res.duration.value/60)+" хв");
                        $(document.getElementById('addressOfDestination')).text(address);
                    }
                });

            }
        });
    });

}

function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}


function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if ( status == google.maps.DirectionsStatus.OK ) {
            var leg = response.routes[ 0 ].legs[ 0 ];
            directionsDisplay.setDirections(response);

            if(marker)marker.setMap(null);
            marker = new google.maps.Marker({
                position: response.routes[0].legs[0].end_location,
                map: map,
                icon: image,
                title:  "Destination"
            });

            homeMarker.setMap(null);
            homeMarker = new google.maps.Marker({
                position: response.routes[0].legs[0].start_location,
                map: map,
                icon: imageHome,
                title:  "Destination"
            });

            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Can' not find direction"));
        }
    });
}

exports.initialize = initialize();


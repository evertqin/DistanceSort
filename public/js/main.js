
var Direction = require('./directions');
var Hub = require('./component.jsx');
var React = require('react');
var ReactDOM = require('react-dom');


window.addEventListener('load', function() {
	var apiUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBYO4IXfAT4Ni3H4XOREgBhkeZJ4JhtZF8&callback=initMap";
	var scriptTag = document.createElement('script');
	scriptTag.setAttribute('async', "");
	scriptTag.setAttribute('defer', "");
	scriptTag.src = apiUrl;
	document.body.appendChild(scriptTag);

});

var map;

window.initMap = function() {
  var chicago = {lat: 41.85, lng: -87.65};
  var indianapolis = {lat: 39.79, lng: -86.14};

  var columbus = {lat:39.9833, lng:-82.9833};
  var nyc  ={lat:40.7127, lng:-74.0059};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: chicago,
    scrollwheel: false,
    zoom: 7
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  // // Set destination, origin and travel mode.
  // var request = {
  //   destination: indianapolis,
  //   origin: chicago,
  //   travelMode: google.maps.TravelMode.DRIVING
  // };

  // // Pass the directions request to the directions service.
  // var directionsService = new google.maps.DirectionsService();
  // directionsService.route(request, function(response, status) {
  //   if (status == google.maps.DirectionsStatus.OK) {
  //     var point = response.routes[ 0 ].legs[ 0 ];
  //     // Display the route on the map.
  //     console.log(point);
  //     directionsDisplay.setDirections(response);
  //   }
  // });

  // var dests = [chicago, columbus, nyc];
  // var dir = new Direction(indianapolis, dests);
  // dir.calcAll((ret) => {
  //   var div = document.createElement('div');
  //   console.log(div);
  //   var ol = div.appendChild(document.createElement('ol'));
  //   ret.sort((a, b)=> {
  //     return a.duration.value - b.duration.value;
  //   });

  //   for(var i = 0; i < ret.length; ++i){
  //     var li = ol.appendChild(document.createElement('li'));
  //     li.textContent = ret[i].end_address + '->' + ret[i].duration.text;
  //   }
  //   document.body.appendChild(div);

  // });

  ReactDOM.render( <Hub />, document.getElementById('result'));

};

module.exports = map;
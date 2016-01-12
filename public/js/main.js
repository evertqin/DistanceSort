
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

  ReactDOM.render( <Hub />, document.getElementById('result'));

module.exports = map;
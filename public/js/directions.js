	/*jslint node: true, esnext:true */

	'use strict';

	class Direction {

		constructor(origin, dests) {
			this.origin = origin;
			this.dests = dests;
		}

		calcDistance(origin, dest, callback) {
			// Set destination, origin and travel mode.
			var request = {
				destination: dest,
				origin: origin,
				travelMode: google.maps.TravelMode.DRIVING
			};

			var directionsService = new google.maps.DirectionsService();
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					var point = response.routes[0].legs[0];
					callback(point);
				}
			});
		}


		calcAll(allDoneCallback) {
			var result = [];
			var count = 0;
			var callback = function(point) {
				result.push(point);
				count++;
				if(count === this.dests.length){
					allDoneCallback(result);
				}
			}.bind(this);

			for (let i = 0; i < this.dests.length; ++i) {
				this.calcDistance(this.origin, this.dests[i], callback);
			}

			return result;
		}
	}

	module.exports = Direction;
(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busSpatialService', busSpatialService);

    busSpatialService.$inject = ['$q', 'BUS'];

    function busSpatialService($q, BUS) {

        var self = this;

        self.getDistance = function(coord1, coord2) {
            var from = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [coord1.latitude, coord1.longitude]
                }
            };
            var to = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [coord2.latitude, coord2.longitude]
                }
            };
            var points = {
                "type": "FeatureCollection",
                "features": [from, to]
            };
            return turf.distance(from, to);
        };

        self.isClose = function(centerCoords, radius, targetCoords) {
            var center = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [centerCoords.latitude, centerCoords.longitude]
                }
            };
            var target = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [targetCoords.latitude, targetCoords.longitude]
                }
            };
            var circle = turf.circle(center, radius, 10);
            return turf.inside(target, circle);
        };

        self.getCurrentPosition = function() {
            var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(
                function success(result) {
                    deferred.resolve(result.coords);
                },
                function error(result) {
                    deferred.reject(result);
                }
            );
            return deferred.promise;
        };

        return self;
    };

})();

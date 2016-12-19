(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('spatialService', spatialService);

    spatialService.$inject = ['$q', 'BUS'];

    function spatialService($q, BUS) {

        var self = this;
        var watchId = 0;

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
            clearWatch();
            var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(
                function success(result) {
                    deferred.resolve(result.coords);
                },
                function error(result) {
                    console.log(result);
                    deferred.reject(result);
                },
                {timeout: 15000, enableHighAccuracy: false}
            );
            return deferred.promise;
        };

        self.watchPosition = function(handler) {
            clearWatch();
            var deferred = $q.defer();
            watchId = navigator.geolocation.watchPosition(
                function success(result){
                    var coords = result.coords;
                    handler(coords.latitude, coords.longitude);
                    deferred.resolve();
                },
                function error(result) {
                    console.error(result);
                    deferred.reject(result);
                },
                {timeout: 15000, enableHighAccuracy: false}
            );
            return deferred.promise;
        };

        function clearWatch() {
            if(watchId != 0){
                navigator.geolocation.clearWatch(watchId);
            }
        };

        return self;
    };

})();

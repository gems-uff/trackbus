(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busSpatialService', busSpatialService);

    busSpatialService.$inject = ['$q', 'BUS', 'TRACKBUS'];

    function busSpatialService($q, BUS, TRACKBUS) {

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
            var deferred = $q.defer();

            clearWatch();
            navigator.geolocation.getCurrentPosition(
                function success(result) {
                    deferred.resolve(result.coords);
                },
                function error(result) {
                    console.log(result);
                    deferred.reject(result);
                },
                {timeout: 5000, enableHighAccuracy: false}
            );
            return deferred.promise;
        };

        self.watchPosition = function(handler) {
            var deferred = $q.defer();

            clearWatch();
            watchId = navigator.geolocation.watchPosition(function(result){
                var coords = result.coords;
                handler(coords.latitude, coords.longitude);
                deferred.resolve();
            });
            return deferred.promise;
        };

        function clearWatch() {
            if(watchId != 0){
                navigator.geolocation.clearWatch(watchId);
            }
        };

        self.getCloseLines = function(buses) {
            return self.getCurrentPosition().then(function(selfCoords) {
                var arr = [];
                var busCoords;
                var line;
                angular.forEach(buses, function(bus) {
                    busCoords = {latitude: bus[BUS.LATITUDE], longitude: bus[BUS.LONGITUDE]};
                    line = bus[BUS.LINE];
                    if(arr.indexOf(line) == -1){
                        if(self.isClose(selfCoords, TRACKBUS.LINE_RADIUS, busCoords)){
                            arr.push(line);
                        }
                    }
                });
                return arr;
            });
        };

        return self;
    };

})();

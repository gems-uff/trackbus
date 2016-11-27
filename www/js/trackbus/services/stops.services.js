(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('stopService', stopService);

    stopService.$inject = ['spatialService'];

    function stopService(spatialService) {

        var self = this;

        self.sortStops = function(stops) {
            return stops.sort(function(a,b) {
                return Number(a.sequencia) - Number(b.sequencia);
            });
        };

        self.getClosestStop = function(stops, position) {
            if(stops.length == 0){
                return null;
            }

            var coords = {latitude: stops[0].latitude, longitude: stops[0].longitude};
            var min_distance = spatialService.getDistance(coords, position);
            var distance = min_distance;
            var min_stop = stops[0];

            for (var i = 1; i < stops.length; i++) {
                coords.latitude = stops[i].latitude;
                coords.longitude = stops[i].longitude;
                distance = spatialService.getDistance(coords, position);
                if(distance < min_distance){
                    min_distance = distance;
                    min_stop = stops[i];
                    min_stop.index = i;
                }
            }
            return min_stop;
        };

        return self;
    };

})();

(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busSpatialService', busSpatialService);

    busSpatialService.$inject = ['BUS'];

    function busSpatialService(BUS) {

        var self = this;

        self.getDistance = function(coord1, coord2) {
            //console.log(coord1, coord2);
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

        return self;
    };

})();

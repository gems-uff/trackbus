(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busService', busService);

    busService.$inject = ['spatialService', 'BUS', 'TRACKBUS'];

    function busService(spatialService, BUS, TRACKBUS) {

        var self = this;

        self.getLines = function(buses, hideEmpty) {
            return getByAttributeDistinct(buses, BUS.LINE, hideEmpty);
        };

        self.getSpeed = function(buses, hideEmpty) {
            return getByAttribute(buses, BUS.SPEED, hideEmpty);
        };

        self.getDirection = function(buses, hideEmpty) {
            return getByAttribute(buses, BUS.DIRECTION, hideEmpty);
        };

        self.getLatLong = function(buses, hideEmpty) {
            return getByAttributes(buses, [BUS.LATITUDE, BUS.LONGITUDE], hideEmpty);
        };

        self.filterEmptyLines = function(list) {
            return list.filter(function(element) {
                return element[BUS.LINE];
            });
        };

        function getByAttribute(list, attr, hideEmpty) {
            var result = [];
            angular.forEach(list, function(element) {
                var value = element[attr];
                if(hideEmpty && value){
                    result.push(value);
                }
            });
            return result;
        };

        function getByAttributeDistinct(list, attr, hideEmpty) {
            var result = [];
            angular.forEach(list, function(element) {
                var value = element[attr];
                if(!result.contains(value) && hideEmpty && value){
                    result.push(value);
                }
            });
            return result;
        };

        function getByAttributes(list, attrs, hideEmpty) {
            var result = [];
            angular.forEach(list, function(element) {
                angular.forEach(attrs, function(a) {
                    if(addEmpty && element[attr]){
                        result.push(element[a]);
                    }
                });
            });
            return result;
        };

        self.getCloseLines = function(buses) {
            return spatialService.getCurrentPosition().then(function(selfCoords) {
                var arr = [];
                var busCoords;
                var line;
                angular.forEach(buses, function(bus) {
                    busCoords = {latitude: bus[BUS.LATITUDE], longitude: bus[BUS.LONGITUDE]};
                    line = bus[BUS.LINE];
                    if(arr.indexOf(line) == -1){
                        if(spatialService.isClose(selfCoords, TRACKBUS.LINE_RADIUS, busCoords)){
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

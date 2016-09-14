(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busFactory', busFactory);

    busFactory.$inject = ['BUS'];

    function busFactory(BUS) {

        var self = this;

        self.getLines = function(buses, showEmpty) {
            return getByAttribute(buses, BUS.LINE, showEmpty, true);
        };

        self.getSpeed = function(buses, showEmpty) {
            return getByAttribute(buses, BUS.LINE, showEmpty);
        };

        self.getDirection = function(buses, showEmpty) {
            return getByAttribute(buses, BUS.LINE, showEmpty);
        };

        self.getLatLong = function(buses, showEmpty) {
            return getByAttributes(buses, [BUS.LATITUDE, BUS.LONGITUDE], showEmpty);
        };

        function getByAttribute(list, attr, addEmpty, distinct) {
            var result = [];
            angular.forEach(list, function(element) {
                var value = element[attr];
                if(addEmpty && value){
                    if(distinct){
                        if(!result.contains(value)){
                            result.push(value);
                        }
                    } else {
                        result.push(value);
                    }
                }
            });
            return result;
        };

        function getByAttributes(list, attrs, addEmpty) {
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


        return self;
    };

})();

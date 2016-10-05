(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busWebFactory', busWebFactory);

    busWebFactory.$inject = ['$q', '$http', 'URL', 'busFactory'];

    function busWebFactory($q, $http, URL, busFactory) {

        var self = this;

        self.listBuses = function(line) {
            var req = {
                method: 'GET',
                url: URL.DATA_RIO.ONIBUS1
            };
            if(line){
                req.url += "/" + line;
            }
            return $http(req).then(function(result) {
                return result.data.DATA;
            });
        };

        self.listLines = function(hideEmpty) {
            return self.listBuses().then(function(result) {
                return busFactory.getLines(result, hideEmpty);
            });
        };

        self.listStops = function(line) {
            var req = {
                method: 'GET',
                url: (
                    URL.DATA_RIO.BUS_STOP.BASE +
                    URL.DATA_RIO.BUS_STOP.BEFORE_LINE
                    + line +
                    URL.DATA_RIO.BUS_STOP.AFTER_LINE
                )
            };
            return $http(req).then(function(result){console.log(result);});
        };

        return self;
    };

})();

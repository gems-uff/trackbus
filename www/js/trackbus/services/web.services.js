(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('webService', webService);

    webService.$inject = ['$q', '$http', 'URL', 'busService'];

    function webService($q, $http, URL, busService) {

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

        self.listAllBuses = function() {
            return self.listBuses().then(function(result) {
                return busService.filterEmptyLines(result);
            });
        };

        self.listLines = function(hideEmpty) {
            return self.listBuses().then(function(result) {
                return busService.getLines(result, hideEmpty);
            });
        };

        self.listStops = function(line) {
            var req = {
                method: 'GET',
                url: (
                    URL.DATA_RIO.BUS_STOP.BASE +
                    URL.DATA_RIO.BUS_STOP.BEFORE_LINE +
                    line +
                    URL.DATA_RIO.BUS_STOP.AFTER_LINE
                )
            };
            return $http(req);
        };

        return self;
    };

})();

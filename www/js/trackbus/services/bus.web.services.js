(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busWebFactory', busWebFactory);

    busWebFactory.$inject = ['$http', 'URL', 'busFactory'];

    function busWebFactory($http, URL, busFactory) {

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

        self.listLines = function(showEmpty) {
            return self.listBuses().then(function(result) {
                return busFactory.getLines(result, showEmpty);
            });
        };

        return self;
    };

})();

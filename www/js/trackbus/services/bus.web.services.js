(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busWebFactory', busWebFactory);

    busWebFactory.$inject = ['$http', 'URL'];

    function busWebFactory($http, URL) {

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

        return self;
    };

})();

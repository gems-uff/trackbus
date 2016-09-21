(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = ['$q', 'busWebFactory', 'busDbFactory', 'busFactory'];

    function busStateFactory($q, busWebFactory, busDbFactory, busFactory) {

        var self = this;

        self.listState = function(){
            return busWebFactory.listLines(true);
        };

        self.mapState = function(line) {
            var promises = [];
            promises.push(busWebFactory.listBuses(line));
            promises.push(busDbFactory.deleteBuses());
            return $q.all(promises).then(function(result) {
                var buses = result[0];
                return busDbFactory.createBuses(buses).then(function() {
                    return buses;
                });
            });
        };

        self.optionsState = function() {
            // body...
        };

        return self;
    };

})();

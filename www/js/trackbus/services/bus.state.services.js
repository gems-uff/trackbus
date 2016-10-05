(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = ['$q', 'busWebFactory', 'busFactory'];

    function busStateFactory($q, busWebFactory, busFactory) {

        var self = this;

        self.listState = function(){
            return busWebFactory.listLines(true);
        };

        self.mapState = function(lines) {
            var promises = [];
            angular.forEach(lines, function(line){
                promises.push(busWebFactory.listBuses(line));
            });
            return $q.all(promises);
        };

        self.optionsState = function(line) {
            return busWebFactory.listStops(line);
        };

        return self;
    };

})();

(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = ['$q', 'busWebFactory', 'busFactory', 'utilsService'];

    function busStateFactory($q, busWebFactory, busFactory, utilsService) {

        var self = this;

        self.listState = function(){
            return busWebFactory.listAllBuses();
        };

        self.mapState = function(lines) {
            var promises = [];
            angular.forEach(lines, function(line){
                promises.push(busWebFactory.listBuses(line));
            });
            return $q.all(promises);
        };

        self.optionsState = function(line) {
            return busWebFactory.listStops(line).then(function(result){
                //result.data is expected to be CSV
                var csv = result.data;
                return utilsService.parseCSV(csv);
            });
        };

        return self;
    };

})();

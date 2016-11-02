(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = [
        '$q',
        'busWebFactory', 'busFactory', 'busSpatialService', 'fileService'
    ];

    function busStateFactory(
        $q,
        busWebFactory, busFactory, busSpatialService, fileService
    ) {

        var self = this;

        self.listState = function(){
            var statePromise = {lines: [], closeLines: []};
            return busWebFactory.listAllBuses().then(function(result) {
                statePromise.lines = busFactory.getLines(result, true);
                return busSpatialService.getCloseLines(result).then(function(result) {
                    statePromise.closeLines = result;
                    return statePromise;
                });
            });
        };

        self.mapState = function(lines) {
            var promises = [];
            angular.forEach(lines, function(line){
                promises.push(busWebFactory.listBuses(line));
            });
            return $q.all(promises);
        };

        self.optionsState = function(line) {
            return fileService.loadJSONFile(line);
        };

        self.tripState = function(line) {
            return fileService.loadJSONFile(line);
        };

        return self;
    };

})();

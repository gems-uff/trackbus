(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = [
        '$q',
        'busWebFactory', 'busFactory', 'busSpatialService', 'fileService', 'configService'
    ];

    function busStateFactory(
        $q,
        busWebFactory, busFactory, busSpatialService, fileService, configService
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

        self.optionsState = function() {
            return configService.getPreferences();
        };

        self.tripState = function(line) {
            return fileService.loadJSONFile(line);
        };

        return self;
    };

})();

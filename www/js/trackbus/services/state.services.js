(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busStateFactory', busStateFactory);

    busStateFactory.$inject = [
        '$q',
        'webService', 'busService', 'spatialService', 'fileService', 'configService'
    ];

    function busStateFactory(
        $q,
        webService, busService, spatialService, fileService, configService
    ) {

        var self = this;

        self.listState = function(){
            var statePromise = {lines: [], closeLines: []};
            return webService.listAllBuses().then(function(result) {
                statePromise.lines = busService.getLines(result, true);
                return busService.getCloseLines(result).then(function(result) {
                    statePromise.closeLines = result;
                    return statePromise;
                });
            });
        };

        self.mapState = function(lines) {
            var promises = [];
            angular.forEach(lines, function(line){
                promises.push(webService.listBuses(line));
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

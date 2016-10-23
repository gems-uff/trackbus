(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('fileService', fileService);

    fileService.$inject = ['$http'];

    function fileService($http) {

        var self = this;

        const DATA_PATH = "data/";
        const LINES_PATH = "lines/";

        self.loadJSONFile = function(line) {
            return $http.get(DATA_PATH + LINES_PATH + line + ".json").then(function(result) {
                return JSON.parse(JSON.stringify(result.data));
            });
        };

        return self;
    };

})();

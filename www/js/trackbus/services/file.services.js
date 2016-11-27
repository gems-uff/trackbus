(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('fileService', fileService);

    fileService.$inject = ['$http', 'alertService', 'ERROR_MESSAGES'];

    function fileService($http, alertService, ERROR_MESSAGES) {

        var self = this;

        const DATA_PATH = "data/";
        const LINES_PATH = "lines/";
        const TOURIST_PATH = "tourist/";

        self.loadLineJSON = function(line) {
            return $http.get(DATA_PATH + LINES_PATH + line + ".json").then(
                function success(result) {
                    return JSON.parse(JSON.stringify(result.data));
                },
                function error(e) {
                    alertService.showAlert("Erro", ERROR_MESSAGES.NO_LINES);
                    throw e;
                }
            );
        };

        self.loadTouristJSON = function(line) {
            return $http.get(DATA_PATH + TOURIST_PATH + line + ".json").then(
                function success(result) {
                    return JSON.parse(JSON.stringify(result.data));
                },
                function error(e) {
                    console.error(e);
                    return [];
                }
            );
        };

        return self;
    };

})();

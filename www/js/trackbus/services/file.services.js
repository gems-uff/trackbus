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

        self.loadJSONFile = function(line) {
            return $http.get(DATA_PATH + LINES_PATH + line + ".json").then(
                function success(result) {
                    return JSON.parse(JSON.stringify(result.data));
                },
                function error() {
                    alertService.showAlert("Erro", ERROR_MESSAGES.NO_LINES);
                    throw error;
                }
            );
        };

        return self;
    };

})();

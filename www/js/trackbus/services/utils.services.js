(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('utilsService', utilsService);

    utilsService.$inject = ['Papa'];

    function utilsService(Papa) {

        var self = this;

        self.parseCSV = function(csv) {
            return Papa.parse(csv, {header: true, dynamicTyping: true});
        };

        return self;
    };

})();

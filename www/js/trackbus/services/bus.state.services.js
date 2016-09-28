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

        self.mapState = function(line) {
            return busWebFactory.listBuses(line);
        };

        self.optionsState = function() {
            // body...
        };

        return self;
    };

})();

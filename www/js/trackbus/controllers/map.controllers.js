(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = ['stateService', 'buses'];

    function MapController(stateService, buses) {
        var vm = this;

        activate();

        function activate() {
            console.log("hello");
        };
    };

})();
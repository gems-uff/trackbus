(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = ['stateService', 'busesPromise'];

    function MapController(stateService, busesPromise) {
        var vm = this;
        var buses = busesPromise;

        activate();

        function activate() {
            console.log(buses);
        };
    };

})();
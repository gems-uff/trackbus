(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('OptionsController', OptionsController);

    OptionsController.$inject = ['stateService', 'stopsPromise'];

    function OptionsController(stateService, stopsPromise) {
        var vm = this;
        var stops = stopsPromise;

        activate();

        function activate() {
            console.log(stops);
        };
    };

})();
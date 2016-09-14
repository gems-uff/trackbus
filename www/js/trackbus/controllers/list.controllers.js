(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = ['stateService', 'lines', 'BUS'];

    function ListController(stateService, lines, BUS) {
        var vm = this;
        var lines = lines;

        vm.displayedLines = lines.slice(0, 10);

        activate();

        function activate() {
            console.log(vm.displayedLines);
        };
    };

})();
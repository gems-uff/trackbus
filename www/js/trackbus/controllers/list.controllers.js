(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = [
        '$scope', 'stateService', 'BUS', 'linesPromise'
    ];

    function ListController(
        $scope, stateService, BUS, linesPromise
    ) {
        var vm = this;
        var lines = linesPromise;

        vm.displayedLines = lines;
        vm.goToMap = stateService.map;

        activate();

        function activate() {};

    };

})();
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
        vm.selectedLines = [];
        vm.addLine = addLine;
        vm.removeLine = removeLine;
        vm.goToMap = stateService.map;

        activate();

        function activate() {};

        function addLine(line) {
            vm.selectedLines.push(line);
            var index = vm.displayedLines.indexOf(line);
            vm.displayedLines.splice(index, 1);
        };

        function removeLine(line) {
            vm.displayedLines.push(line);
            var index = vm.selectedLines.indexOf(line);
            vm.selectedLines.splice(index, 1);
        };

    };

})();
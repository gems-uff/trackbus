(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = [
        'filterFilter', '$scope', 'stateService', 'alertService',
        'linesPromise',
        'BUS', 'ERROR_MESSAGES', 'TRACKBUS'
    ];

    function ListController(
        filterFilter, $scope, stateService, alertService,
        linesPromise,
        BUS, ERROR_MESSAGES, TRACKBUS
    ) {
        var vm = this;
        var lines = linesPromise.lines;

        vm.lineFilter = "";
        vm.closeLines = linesPromise.closeLines;
        vm.filteredLines = [];
        vm.selectedLines = [];

        vm.addLine = addLine;
        vm.removeLine = removeLine;
        vm.filterLines = filterLines;
        vm.goToMap = stateService.map;

        activate();

        function activate() {
            vm.closeLines = sortLines(vm.closeLines);
        };

        function addLine(line) {
            if(vm.selectedLines.length >= TRACKBUS.MAX_LINES){
                return alertService.showAlert("Erro", ERROR_MESSAGES.MAX_LINES);
            } else if(vm.selectedLines.indexOf(line) != -1){
                return alertService.showAlert("Erro", ERROR_MESSAGES.ALREADY_PRESENT);
            }
            vm.selectedLines.push(line);
        };

        function removeLine(line) {
            var index = vm.selectedLines.indexOf(line);
            vm.selectedLines.splice(index, 1);
        };

        function filterLines() {
            vm.filteredLines = filterFilter(lines, vm.lineFilter);
        };

        function sortLines(arr){
            return arr.sort(function(a,b){
                return a - b;
            });
        };

    };

})();
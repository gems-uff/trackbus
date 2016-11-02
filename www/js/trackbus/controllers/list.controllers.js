(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = [
        'filterFilter', '$scope', '$anchorScroll', 'stateService', 'alertService',
        'linesPromise',
        'BUS', 'ERROR_MESSAGES', 'TRACKBUS'
    ];

    function ListController(
        filterFilter, $scope, $anchorScroll, stateService, alertService,
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

        function activate() {};

        function addLine(line) {
            if(vm.selectedLines.length >= TRACKBUS.MAX_LINES){
                return alertService.showAlert("Erro", ERROR_MESSAGES.MAX_LINES);
            } else if(vm.selectedLines.indexOf(line) != -1){
                return alertService.showAlert("Erro", ERROR_MESSAGES.ALREADY_PRESENT);
            }
            vm.selectedLines.push(line);
            $anchorScroll(); //not working :(
        };

        function removeLine(line) {
            var index = vm.selectedLines.indexOf(line);
            vm.selectedLines.splice(index, 1);
        };

        function filterLines() {
            vm.filteredLines = filterFilter(lines, vm.lineFilter);
        };

    };

})();
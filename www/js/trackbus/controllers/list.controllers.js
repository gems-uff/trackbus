(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = [
        '$scope', 'stateService', 'alertService', 'BUS', 'linesPromise', 'ERROR_MESSAGES'
    ];

    function ListController(
        $scope, stateService, alertService, BUS, linesPromise, ERROR_MESSAGES
    ) {
        var vm = this;
        var lines = linesPromise;
        const maxLines = 3;

        vm.displayedLines = lines;
        vm.selectedLines = [];
        vm.addLine = addLine;
        vm.removeLine = removeLine;
        vm.goToMap = stateService.map;

        activate();

        function activate() {};

        function addLine(line) {
            if(vm.selectedLines.length >= maxLines){
                return alertService.showAlert("Erro", ERROR_MESSAGES.MAX_LINES);
            }
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
(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = [
        '$scope', 'stateService', 'alertService', 'busSpatialService',
        'linesPromise',
        'BUS', 'ERROR_MESSAGES', 'TRACKBUS'
    ];

    function ListController(
        $scope, stateService, alertService, busSpatialService,
        linesPromise,
        BUS, ERROR_MESSAGES, TRACKBUS
    ) {
        var vm = this;
        var buses = linesPromise;
        var closeLines = [];

        vm.displayedLines = buses;
        vm.selectedLines = [];
        vm.addLine = addLine;
        vm.removeLine = removeLine;
        vm.goToMap = stateService.map;

        activate();

        function activate() {
            return getCloseLines().then(function(result){
                closeLines = result;
            });
        };

        function addLine(line) {
            if(vm.selectedLines.length >= TRACKBUS.MAX_LINES){
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

        function getCloseLines() {
            return getCurrentPosition().then(function(result) {
                var arr = [];
                var selfCoords = result;

                angular.forEach(buses, function(bus) {
                    var busCoords = {latitude: bus[BUS.LATITUDE], longitude: bus[BUS.LONGITUDE]};
                    if(busSpatialService.isClose(selfCoords, TRACKBUS.LINE_RADIUS, busCoords)){
                        arr.push(bus);
                    }
                });

                return arr;
            });
        };

        function getCurrentPosition(){
            return busSpatialService.getCurrentPosition().then(
                function success(result) {
                    return {latitude: result.latitude, longitude: result.longitude};
                },
                function error(result){
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                }
            );
        };

    };

})();
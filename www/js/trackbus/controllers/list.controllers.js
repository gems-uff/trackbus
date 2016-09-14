(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('ListController', ListController);

    ListController.$inject = ['stateService', 'lines'];

    function ListController(stateService, lines) {
        var vm = this;

        vm.lines = lines;

        activate();

        function activate() {
            console.log(vm.lines);
        };
    };

})();
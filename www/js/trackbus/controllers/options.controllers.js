(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('OptionsController', OptionsController);

    OptionsController.$inject = [];

    function OptionsController(stateService) {
        var vm = this;

        activate();

        function activate() {
            console.log("hello");
        };
    };

})();
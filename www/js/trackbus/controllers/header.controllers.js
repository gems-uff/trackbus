(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['stateService'];

    function HeaderController(stateService) {
        var header = this;

        header.goToOptions = stateService.options;

        activate();

        function activate() {};
    };

})();
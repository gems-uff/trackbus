(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['stateService', '$ionicHistory', 'STATES'];

    function HeaderController(stateService, $ionicHistory, STATES) {
        var header = this;

        header.goToOptions = stateService.options;
        header.showOptions = showOptions;

        activate();

        function activate() {};

        function showOptions() {
            return $ionicHistory.currentView().stateId !== STATES.OPTIONS;
        };
    };

})();
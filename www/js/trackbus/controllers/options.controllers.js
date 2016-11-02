(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('OptionsController', OptionsController);

    OptionsController.$inject = [
        '$stateParams',
        'stateService', 'stopsPromise',
        'OPTIONS'
    ];

    function OptionsController(
        $stateParams,
        stateService, stopsPromise,
        OPTIONS
    ) {
        var vm = this;
        var stops = stopsPromise;

        vm.OPTIONS = OPTIONS;
        vm.line = $stateParams.line;

        vm.goToTrip = stateService.trip;

        vm.options = {
            notification: {
                vibration: true,
                soundAlert: OPTIONS.SOUND_ALERT
            },
            tourist: {
                enable: true
            }
        };

        activate();

        function activate() {};
    };

})();
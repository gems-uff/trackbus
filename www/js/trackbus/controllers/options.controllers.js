(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('OptionsController', OptionsController);

    OptionsController.$inject = [
        '$stateParams', '$ionicHistory',
        'configService',
        'configPromise',
        'OPTIONS'
    ];

    function OptionsController(
        $stateParams, $ionicHistory,
        configService,
        configPromise,
        OPTIONS
    ) {
        var vm = this;

        vm.OPTIONS = OPTIONS;
        vm.options = configPromise;
        // Options defaults
        // vm.options = {
        //     notification: {
        //         vibration: true,
        //         soundAlert: OPTIONS.SOUND.SOUND_ALERT,
        //         busDistance: OPTIONS.DISTANCE.BUS_DISTANCE,
        //         stopDistance: OPTIONS.DISTANCE.STOP_DISTANCE,
        //         touristDistance: OPTIONS.DISTANCE.TOURIST_DISTANCE,
        //     },
        //     tourist: {
        //         enable: true
        //     }
        // };
        // vm.busDistanceMeters;

        vm.stopDistanceMeters;
        vm.setBusDistanceDefault = setBusDistanceDefault;
        vm.setStopDistanceDefault = setStopDistanceDefault;
        vm.setTouristDistanceDefault = setTouristDistanceDefault;

        vm.save = save;

        activate();

        function activate() {
            vm.options.notification.busDistance = toMeters(vm.options.notification.busDistance);
            vm.options.notification.stopDistance = toMeters(vm.options.notification.stopDistance);
            vm.options.notification.touristDistance = toMeters(vm.options.notification.touristDistance);
        };

        function toKilometers(value){
            return value/1000;
        };

        function toMeters(value) {
            return value*1000;
        };

        function setBusDistanceDefault() {
            vm.options.notification.busDistance = toMeters(OPTIONS.DISTANCE.BUS_DISTANCE);
        };

        function setStopDistanceDefault() {
            vm.options.notification.stopDistance = toMeters(OPTIONS.DISTANCE.STOP_DISTANCE);
        };

        function setTouristDistanceDefault() {
            vm.options.notification.touristDistance = toMeters(OPTIONS.DISTANCE.TOURIST_DISTANCE);
        };

        function save() {
            vm.options.notification.busDistance = toKilometers(vm.options.notification.busDistance);
            vm.options.notification.stopDistance = toKilometers(vm.options.notification.stopDistance);
            vm.options.notification.touristDistance = toKilometers(vm.options.notification.touristDistance);

            configService.savePreferences(vm.options);
            $ionicHistory.goBack();
        };
    };

})();
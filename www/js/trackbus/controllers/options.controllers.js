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
        vm.save = save;

        activate();

        function activate() {};

        function save() {
            configService.savePreferences(vm.options);
            $ionicHistory.goBack();
        };
    };

})();
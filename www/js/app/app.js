(function() {
    'use strict';

    angular
        .module('app',[
            'ionic', 'ui.router', 'database',
            'alerts', 'states', 'trackbus',
            'messages', 'URLConstants'
        ])
        .run(run);

    run.$inject = ['$ionicPlatform', '$window', 'DB', 'stateService'];

    function run($ionicPlatform, $window, DB, stateService) {
        $ionicPlatform.ready(function() {
            DB.init().then(function(){
                function ionicDefaults(){
                    if($window.cordova && $window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        cordova.plugins.Keyboard.disableScroll(true);
                    }
                    if($window.StatusBar) {
                        StatusBar.styleDefault();
                    }
                };

                ionicDefaults();
                stateService.intro();
            });
        });
    };

})();

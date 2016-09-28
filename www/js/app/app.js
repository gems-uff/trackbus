(function() {
    'use strict';

    angular
        .module('app',[
            'ionic', 'ui.router', 'ngCordova',
            'alerts', 'states', 'trackbus',
            'messages', 'URLConstants'
        ])
        .run(run);

    run.$inject = ['$ionicPlatform', '$window', 'stateService'];

    function run($ionicPlatform, $window, stateService) {
        $ionicPlatform.ready(function() {
            function ionicDefaults(){
                if($window.cordova && $window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if($window.StatusBar) {
                    StatusBar.styleDefault();
                }
            };
            function ArrayContainsPolyfill() {
                if (![].contains) {
                    Object.defineProperty(Array.prototype, 'contains', {
                        enumerable: false,
                        configurable: true,
                        writable: true,
                        value: function(searchElement/*, fromIndex*/) {
                            if (this === undefined || this === null) {
                                throw new TypeError('Cannot convert this value to object');
                            }
                            var O = Object(this);
                            var len = parseInt(O.length) || 0;
                            if (len === 0) { return false; }
                            var n = parseInt(arguments[1]) || 0;
                            if (n >= len) { return false; }
                            var k;
                            if (n >= 0) {
                                k = n;
                            } else {
                                k = len + n;
                                if (k < 0) k = 0;
                            }
                            while (k < len) {
                                var currentElement = O[k];
                                if (
                                    searchElement === currentElement ||
                                    searchElement !== searchElement &&
                                    currentElement !== currentElement
                                ) {
                                    return true;
                                }
                                    k++;
                            }
                            return false;
                        }
                    });
                }
            };

            ionicDefaults();
            ArrayContainsPolyfill();
            stateService.intro();
        });
    };

})();

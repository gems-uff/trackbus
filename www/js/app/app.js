(function() {
    'use strict';

    angular
        .module('app',[
            'ionic', 'ui.router', 'ngCordova',
            'alerts', 'states', 'trackbus', 'utils'
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
            function hashCodePolyfill() {
                String.prototype.hashCode = function() {
                    var hash = 0, i, chr, len;
                    if (this.length === 0) return hash;
                    for (i = 0, len = this.length; i < len; i++) {
                        chr   = this.charCodeAt(i);
                        hash  = ((hash << 5) - hash) + chr;
                        hash |= 0; // Convert to 32bit integer
                    }
                    return hash;
                };
            };

            ionicDefaults();
            ArrayContainsPolyfill();
            hashCodePolyfill();
            stateService.intro();
        });
    };

})();

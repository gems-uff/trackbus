(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('configService', configService);

    configService.$inject = ['$window', 'OPTIONS'];

    function configService($window, OPTIONS) {

        var self = this;

        const PREFERENCES = "PREFERENCES";
        const DEFAULT_OPTIONS = {
            notification: {
                vibration: true,
                soundAlert: OPTIONS.SOUND.SOUND_ALERT,
                busDistance: OPTIONS.DISTANCE.BUS_DISTANCE,
                stopDistance: OPTIONS.DISTANCE.STOP_DISTANCE,
            },
            tourist: {
                enable: true
            }
        };

        self.getPreferences = function() {
            var pref;
            try{
                pref = JSON.parse($window.localStorage[PREFERENCES]);
            } catch(e){
                pref = DEFAULT_OPTIONS;
            }
            return pref;
        };

        self.savePreferences = function(options) {
            $window.localStorage[PREFERENCES] = JSON.stringify(options);
        };

        return self;
    };

})();

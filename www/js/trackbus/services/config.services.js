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
                touristDistance: OPTIONS.DISTANCE.TOURIST_DISTANCE,
            },
            tourist: {
                enable: true
            },
            precisionMode: OPTIONS.PRECISION_MODE
        };

        self.getPreferences = function() {
            var prefs;
            try{
                prefs = JSON.parse($window.localStorage[PREFERENCES]);
            } catch(e){
                prefs = DEFAULT_OPTIONS;
            }
            return prefs;
        };

        self.savePreferences = function(options) {
            $window.localStorage[PREFERENCES] = JSON.stringify(options);
        };

        return self;
    };

})();

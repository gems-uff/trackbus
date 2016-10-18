(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('notificationService', notificationService);

    notificationService.$inject = [
        '$rootScope',
        '$cordovaLocalNotification', '$cordovaVibration',
        'BUS'
    ];

    function notificationService(
        $rootScope,
        $cordovaLocalNotification, $cordovaVibration,
        BUS
    ) {

        var self = this;

        activate();

        function activate(){
            $rootScope.$on('$cordovaLocalNotification:trigger', function(event, notification, state) {
                $cordovaVibration.vibrate(500);
            });
        };

        self.scheduleBusNotification = function(bus) {
            return $cordovaLocalNotification.schedule({
                title: "Ônibus " + bus.line,
                text: "O ônibus está a " + bus.distance + "km.",
                sound: "file://sounds/honk.mp3"
            });
        };

        return self;
    };

})();

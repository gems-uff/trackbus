(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('notificationService', notificationService);

    notificationService.$inject = ['$cordovaLocalNotification', '$cordovaVibration', 'BUS'];

    function notificationService($cordovaLocalNotification, $cordovaVibration, BUS) {

        var self = this;

        self.scheduleBusProximityNotification = function(bus) {
            $cordovaLocalNotification.schedule({
                id: bus[BUS.ORDER],
                title: "Ônibus " + bus[BUS.LINE],
                text: 'O ônibus está se aproximando.'
            }).then(function (result) {
                $cordovaVibration.vibrate(300);
            });
        };

        return self;
    };

})();

(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('notificationService', notificationService);

    notificationService.$inject = ['$cordovaLocalNotification', '$cordovaVibration', 'BUS'];

    function notificationService($cordovaLocalNotification, $cordovaVibration, BUS) {

        var self = this;

        self.scheduleBusNotification = function(bus) {
            $cordovaLocalNotification.schedule({
                title: "Ônibus " + bus.line,
                text: "O ônibus está a " + bus.distance + "km."
            }).then(function (result) {
                $cordovaVibration.vibrate(300);
            });
        };

        return self;
    };

})();

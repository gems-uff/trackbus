(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('notificationService', notificationService);

    notificationService.$inject = [
        '$q', '$rootScope',
        '$cordovaLocalNotification', '$cordovaVibration',
        'BUS'
    ];

    function notificationService(
        $q, $rootScope,
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
            var busId = bus.id.hashCode();
            var promises = {
                scheduled: $cordovaLocalNotification.isScheduled(busId),
                triggered: $cordovaLocalNotification.isTriggered(busId)
            };

            return $q.all(promises).then(function(result){
                if(!result.scheduled && !result.triggered){
                    return $cordovaLocalNotification.schedule({
                        id: busId,
                        title: "Ônibus " + bus.line,
                        text: "O ônibus está a " + bus.distance + "km.",
                        sound: "file://sounds/honk.mp3"
                    });
                }
            });
        };

        return self;
    };

})();

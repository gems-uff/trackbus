(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('notificationService', notificationService);

    notificationService.$inject = [
        '$q', '$rootScope',
        '$cordovaLocalNotification', '$cordovaVibration',
        'textToSpeechService', 'configService', 'OPTIONS',
        'BUS'
    ];

    function notificationService(
        $q, $rootScope,
        $cordovaLocalNotification, $cordovaVibration,
        textToSpeechService, configService, OPTIONS,
        BUS
    ) {

        var self = this;

        activate();

        function activate(){
            $rootScope.$on('$cordovaLocalNotification:trigger', function(event, notification, state) {
                var prefs = configService.getPreferences();
                if(prefs.notification.vibration){
                    $cordovaVibration.vibrate(500);
                }
                if(prefs.notification.soundAlert == OPTIONS.SOUND.VOICE){
                    var tts = JSON.parse(notification.data).speechText;
                    return textToSpeechService.speak(tts);
                }
            });
        };

        function getSound() {
            var prefs = configService.getPreferences();
            return prefs.notification.soundAlert == OPTIONS.SOUND.SOUND_ALERT ? "file://sounds/honk.mp3":null;
        };

        function schedule(notification) {
            if(!window.cordova){
                console.log("notified!", notification);
                return;
            }
            var promises = {
                scheduled: $cordovaLocalNotification.isScheduled(notification.id),
                triggered: $cordovaLocalNotification.isTriggered(notification.id)
            };
            return $q.all(promises).then(function(result){
                if(!result.scheduled && !result.triggered){
                    return $cordovaLocalNotification.schedule(notification);
                }
            });
        };

        function toKilometers(value){
            return value/1000;
        };

        function toMeters(value) {
            return value*1000;
        };

        self.scheduleBusNotification = function(bus) {
            return schedule({
                id: bus.id.hashCode(),
                title: "Ônibus " + bus.line,
                text: "O ônibus está a " + toMeters(Number(bus.distance)).toFixed(0) + "m.",
                sound: getSound(),
                data: {
                    speechText: "Ônibus " + bus.line + " está próximo."
                },
                icon: "res://icon_notification.png"
            });
        };

        self.scheduleStopNotification = function(stop) {
            return schedule({
                id: stop.sequencia,
                title: "Ponto " + stop.descricao_ponto,
                text: "O ponto está a " + toMeters(Number(stop.distance)).toFixed(0) + "m.",
                sound: getSound(),
                data: {
                    speechText: "Próximo ponto " + stop.descricao_ponto
                },
                icon: "res://icon_notification.png"
            });
        };

        self.scheduleTouristNotification = function(ts) {
            console.log(ts);
            return schedule({
                id: ts.id.hashCode(),
                title: ts.id,
                text: "O ponto está a " + toMeters(Number(ts.distance)).toFixed(0) + "m.",
                sound: getSound(),
                data: {
                    speechText: (ts.id + " a " + toMeters(Number(ts.distance)).toFixed(0) + " metros")
                },
                icon: "res://icon_notification.png"
            });
        };

        return self;
    };

})();

(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('backgroundService', backgroundService);

    backgroundService.$inject = [];

    function backgroundService() {

        var self = this;

        activate();

        function activate(argument) {
            if(window.cordova){
                cordova.plugins.backgroundMode.onfailure = function(errorCode) {
                    console.error(errorCode);
                };
            }
        };

        self.activate = function(title) {
            if(window.cordova){
                cordova.plugins.backgroundMode.setDefaults({
                    title: "TrackBus",
                    text: "Observando localização dos ônibus.",
                    icon: "icon_notification"
                });
                cordova.plugins.backgroundMode.enable();
            }
        };

        self.deactivate = function() {
            if(window.cordova){
                cordova.plugins.backgroundMode.disable();
            }
        };


        return self;
    };

})();

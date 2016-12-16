(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('backgroundService', backgroundService);

    backgroundService.$inject = [];

    function backgroundService() {

        var self = this;
        var bgm;

        activate();

        function activate() {
            if(!window.cordova){
                return;
            }
            bgm = cordova.plugins.backgroundMode;
            bgm.onfailure = function(errorCode) {
                console.error(errorCode);
            };

        };

        self.activate = function(text) {
            if(!window.cordova){
                return;
            }
            bgm.enable();
            bgm.setDefaults({
                title: "TrackBus",
                text: text,
                icon: "icon_notification"
            });
        };

        self.deactivate = function() {
            if(!window.cordova){
                return;
            }
            //bgm.disable(); //not working as intended
        };


        return self;
    };

})();

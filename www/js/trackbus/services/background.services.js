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
            bgm.setDefaults({
                title: "TrackBus",
                icon: "icon_notification"
            });
        };

        self.activate = function(title) {
            if(!window.cordova){
                return;
            }
            bgm.enable();
            bgm.configure({
                text: title,
            });
        };

        self.deactivate = function() {
            if(!window.cordova){
                return;
            }
            bgm.disable();
        };


        return self;
    };

})();

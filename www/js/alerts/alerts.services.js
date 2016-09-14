(function() {
    'use strict';
    angular
        .module('alerts')
        .factory('alertService', alertService);

    alertService.$inject = ['$ionicPopup', '$ionicLoading'];

    function alertService($ionicPopup, $ionicLoading) {
        var self = this;

        self.showLoading = function() {
            $ionicLoading.show();
        };

        self.hideLoading = function() {
            $ionicLoading.hide();
        };

        self.showAlert = function(title, message){
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
        };

        self.showConfirmation = function(title, message, callback) {
            var cancelButton = { text: "Cancelar"};
            var confirmButton = {
                text: 'Confirmar',
                type: 'button-positive',
                onTap: function(answer) {
                    if (answer) {
                        callback();
                    }
                }
            };

            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: message,
                buttons: [cancelButton, confirmButton]
            });
        };

        return self;
    }
})();
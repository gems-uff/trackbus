(function() {
    'use strict';

    angular
        .module('app')
        .controller('InitController', InitController);

    InitController.$inject = ['$state', '$rootScope', 'alertService', 'stateService', 'ERROR_MESSAGES'];

    function InitController($state, $rootScope, alertService, stateService, ERROR_MESSAGES) {
        var vm = this;

        vm.goToList = stateService.list;
        vm.goToOptions = stateService.options;

        activate();

        function activate() {
            setLoadingEvents();
        };

        function setLoadingEvents(){
            //triggers loading on every state change
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                alertService.showLoading();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                alertService.hideLoading();
            });
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                console.error(error);
                alertService.hideLoading();

                if(error.constructor.name ==  "PositionError"){
                    alertService.showAlert("Erro", ERROR_MESSAGES.LOCATION_UNAVAILABLE);
                    return;
                }
                switch(error.status){
                    case 404:
                        alertService.showAlert("Erro", ERROR_MESSAGES.SERVICE_UNAVAILABLE);
                        break;
                    case -1:
                        alertService.showAlert("Erro", ERROR_MESSAGES.NO_CONNECTION);
                        break;
                    default:
                        alertService.showGenericError();
                }
            });
        };
    };

})();
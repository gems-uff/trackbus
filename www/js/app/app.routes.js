(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', 'STATES'];

    function config($stateProvider, STATES){
        $stateProvider
            .state(STATES.INTRO, {
                url: '/intro',
                templateUrl: 'templates/intro.html',
                controller: 'InitController',
                controllerAs: 'vm'
            });
    };

})();
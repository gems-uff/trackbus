(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', 'STATES'];

    function config($stateProvider, STATES){
        $stateProvider
            .state(STATES.HEADER, {
                url: '/',
                abstract: true,
                templateUrl: 'templates/trackbus/header.html',
                controller: 'HeaderController',
                controllerAs: 'header'
            })
            .state(STATES.INTRO, {
                url: 'intro',
                templateUrl: 'templates/trackbus/intro.html',
                controller: 'InitController',
                controllerAs: 'vm'
            });
    };

})();
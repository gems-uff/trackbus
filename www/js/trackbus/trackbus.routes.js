(function() {
    'use strict';

    angular
        .module('trackbus')
        .config(config);

    config.$inject = ['$stateProvider', 'STATES'];

    function config($stateProvider, STATES) {
        $stateProvider
            .state(STATES.LIST, {
                url: '/list',
                templateUrl: 'templates/trackbus/list.html',
                controller: 'ListController',
                controllerAs: 'vm',
                resolve: {
                    linesPromise: function(busStateFactory) {
                        return busStateFactory.listState();
                    }
                }
            })
            .state(STATES.MAP, {
                url: '/map',
                params:{
                    lines: []
                },
                templateUrl: 'templates/trackbus/map.html',
                controller: 'MapController',
                controllerAs: 'vm',
                resolve: {
                    busesPromise: function(busStateFactory, $stateParams) {
                        return busStateFactory.mapState($stateParams.lines);
                    }
                }
            })
            .state(STATES.OPTIONS, {
                url: '/options',
                templateUrl: 'templates/trackbus/options.html',
                controller: 'OptionsController',
                controllerAs: 'vm'
            });
    };

})();
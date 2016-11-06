(function() {
    'use strict';

    angular
        .module('trackbus')
        .config(config);

    config.$inject = ['$stateProvider', 'STATES'];

    function config($stateProvider, STATES) {
        $stateProvider
            .state(STATES.LIST, {
                url: 'list',
                views: {
                    "headerContent":{
                        templateUrl: 'templates/trackbus/list.html',
                        controller: 'ListController',
                        controllerAs: 'vm',
                        resolve: {
                            linesPromise: function(busStateFactory) {
                                return busStateFactory.listState();
                            }
                        }
                    }
                }
            })
            .state(STATES.MAP, {
                url: 'map',
                params:{
                    lines: []
                },
                views: {
                    "headerContent":{
                        templateUrl: 'templates/trackbus/map.html',
                        controller: 'BusMapController',
                        controllerAs: 'vm',
                        resolve: {
                            busesPromise: function(busStateFactory, $stateParams) {
                                return busStateFactory.mapState($stateParams.lines);
                            },
                            configPromise: function(busStateFactory) {
                                return busStateFactory.optionsState();
                            }
                        }
                    }
                }
            })
            .state(STATES.OPTIONS, {
                url: 'options',
                views: {
                    "headerContent":{
                        templateUrl: 'templates/trackbus/options.html',
                        controller: 'OptionsController',
                        controllerAs: 'vm',
                        resolve: {
                            configPromise: function(busStateFactory) {
                                return busStateFactory.optionsState();
                            }
                        }
                    }
                }
            })
            .state(STATES.TRIP, {
                url: 'trip',
                params: {
                    line: ""
                },
                views: {
                    "headerContent":{
                        templateUrl: 'templates/trackbus/trip.html',
                        controller: 'TripController',
                        controllerAs: 'vm',
                        resolve: {
                            stopsPromise: function(busStateFactory, $stateParams) {
                                return busStateFactory.tripState($stateParams.line);
                            },
                            configPromise: function(busStateFactory) {
                                return busStateFactory.optionsState();
                            }
                        }
                    }
                }
            });
    };

})();
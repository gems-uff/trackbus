(function() {
    'use strict';

    angular
        .module('stops_equivalence')
        .config(config);

    config.$inject = ['$stateProvider', 'STATES'];

    function config($stateProvider, STATES){
        $stateProvider
            .state(STATES.STOPS_EQUIVALENCE, {
                url: '/stops_equivalence',
                templateUrl: 'templates/stops_equivalence/stops_equivalence.html',
                controller: 'StopsEquivalenceController',
                controllerAs: 'vm'
            });
    };

})();
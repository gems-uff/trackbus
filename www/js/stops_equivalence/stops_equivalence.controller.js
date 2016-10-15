(function() {
    'use strict';

    angular
        .module('stops_equivalence')
        .controller('StopsEquivalenceController', StopsEquivalenceController);

    StopsEquivalenceController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation', '$stateParams',
        'stateService', 'busSpatialService',
        'busesPromise',
        'BUS'
    ];

    function StopsEquivalenceController(
        $scope, uiGmapGoogleMapApi, $cordovaGeolocation, $stateParams,
        stateService, busSpatialService,
        busesPromise,
        BUS
    ) {
        
    };

})();
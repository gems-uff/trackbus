(function() {
    'use strict';

    angular
        .module('stops_equivalence')
        .controller('StopsEquivalenceController', StopsEquivalenceController);

    StopsEquivalenceController.$inject = [
        'Papa', 'busSpatialService', 'BUS'
    ];

    function StopsEquivalenceController(
        Papa, busSpatialService, BUS
    ) {

        activate();

        function activate(argument) {
            console.log(Papa);
            console.log(busSpatialService);
        };
    };

})();
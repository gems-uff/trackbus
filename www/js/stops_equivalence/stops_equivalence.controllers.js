(function() {
    'use strict';

    angular
        .module('stops_equivalence')
        .controller('StopsEquivalenceController', StopsEquivalenceController);

    StopsEquivalenceController.$inject = [
        'Papa', 'busSpatialService', 'BUS', '$q'
    ];

    function StopsEquivalenceController(
        Papa, busSpatialService, BUS, $q
    ) {

        var result_file;
        var line_stops_file = ('data_files/pontos_por_linha.csv'); 
        var stops_description_file = ('data_files/stops_description.csv');

        var line_stops 
        var stops_description;
        
        start();


        function start() {
            parseFiles().then(matchStops);
        };

        function fileParseError(result) {
            alert("ERROR reading the file");
        };

        function fileParser(file) {
            return Papa.parse(file, {
                download: true,
            })
            .then(function(result){
                return result.data;
            })
            .catch(fileParseError)
        };

        function parseFiles() {
            var promises = [];
            promises.push(
                fileParser(line_stops_file).then(function(result){
                    line_stops = result;
                })
            );
            promises.push(
                fileParser(stops_description_file).then(function(result){
                    stops_description = result;
                })
            );
            return $q.all(promises);
        };  


        function matchStops(){
            debugger
        };
    };
})();
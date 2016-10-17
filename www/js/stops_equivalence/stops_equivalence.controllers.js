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

        var line_stops;
        var stops_description;
        var max_distance = 5;
        
        start();


        function start() {
            console.log(Papa);
            console.log(busSpatialService);
            parseFiles().then(matchStops);
        };

        function fileParseError(result) {
            alert("ERROR reading the file");
        };

        function fileParser(file) {
            return Papa.parse(file, {
                download: true,
                header: true,
                dynamicTyping: true
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
            var distance;
            var result = [];
            angular.forEach(line_stops, function(line, line_id){
                angular.forEach(stops_description, function(stop, stop_id){
                    line.coordinates = {latitude: line.latitude, longitude: line.longitude};
                    stop.coordinates = {latitude: stop.stop_lat, longitude: stop.stop_lon};
                    distance = busSpatialService.getDistance(line.coordinates, stop.coordinates);
                    if (distance < max_distance){
                        result.push({
                            linha: line.linha,
                            sequencia: line.sequencia,
                            nome: line.descricao,
                            descricao: stop.stop_name,
                            latitude: line.latitude,
                            longitude: line.longitude
                        });
                    };
                    console.log(line_id);
                });
            });
            console.log(result);
            debugger
        };

    };
})();
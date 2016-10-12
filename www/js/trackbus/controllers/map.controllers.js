(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation', '$stateParams', '$interval',
        'stateService', 'busSpatialService', 'busStateFactory',
        'busesPromise',
        'BUS', 'BUS_ICONS'
    ];

    function MapController(
        $scope, uiGmapGoogleMapApi, $cordovaGeolocation, $stateParams, $interval,
        stateService, busSpatialService, busStateFactory,
        busesLinePromise,
        BUS, BUS_ICONS
    ) {
        var vm = this;
        var lines = busesLinePromise;
        var gmap;

        // Google Maps
        vm.busMarkers = [];
        vm.userMarker = {
            coords: {latitude: 0, longitude: 0},
            options: {icon: "img/person.png"}
        };
        vm.map = {
            center: {latitude: 0, longitude: 0},
            zoom: 15
        };
        vm.searchbox = {
            template:'searchbox.tpl.html',
            events:{
                places_changed: function (searchBox) {
                    var location = searchBox.getPlaces()[0].geometry.location;
                    setPosition(location.lat(), location.lon());
                }
            },
            position:"top-right"
        };
        // Google Maps

        vm.linesIds = [];

        vm.setCurrentPosition = setCurrentPosition;
        vm.notifyProximity = notifyProximity;
        vm.goToOptions = stateService.options;

        activate();

        function activate() {
            function mapSetup(){
                return uiGmapGoogleMapApi.then(function(maps) {
                    gmap = maps;
                    return setCurrentPosition();
                });
            };
            function watchUserPosition() {
                navigator.geolocation.watchPosition(function(result){
                    var coords = result.coords;
                    setUserPosition(coords.latitude, coords.longitude);
                });
            };
            function setUpdateInterval(){
                //updates every minute
                $interval(updateLines, 60000);
            };

            return mapSetup().then(function(){
                watchUserPosition();
                getLinesIds();
                initializeBusMarkers();
                setUpdateInterval();
            });
        };

        function getLinesIds() {
            var arr = [];
            angular.forEach(lines, function(line) {
                arr.push(line[0][BUS.LINE]);
            });
            vm.linesIds = arr;
        };

        function updateLines(){
            return busStateFactory.mapState(vm.linesIds).then(function(result){
                lines = result;
                getLinesIds();
                initializeBusMarkers();
            });
        };

        function setCurrentPosition(zoom) {
            return navigator.geolocation.getCurrentPosition(
                function success(result) {
                    var coords = result.coords;
                    setUserPosition(coords.latitude, coords.longitude);
                    setPosition(coords.latitude, coords.longitude, zoom);
                },
                function failure(result) {
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                });
        };

        function setPosition(lat, lon, zoom) {
            vm.map.refresh({latitude: lat, longitude: lon});
            if(zoom){
                vm.map.zoom = zoom;
            }
        };

        function setUserPosition(lat, lon) {
            vm.userMarker.coords = {latitude: lat, longitude: lon};
        };

        function initializeBusMarkers(){
            var lineIndex = 0;
            var result = [];
            vm.busMarkers = [];
            angular.forEach(lines, function(line) {
                angular.forEach(line, function(bus) {
                    result.push(generateBusMarker(bus, lineIndex));
                });
                lineIndex++;
            });
            vm.busMarkers = result;
        };

        function generateBusMarker(bus, lineIndex) {
            //coords must contain latitude and longitude
            return {
                id: bus[BUS.ORDER],
                options: {icon: BUS_ICONS[lineIndex]},
                coords: {
                    latitude: bus[BUS.LATITUDE],
                    longitude: bus[BUS.LONGITUDE]
                }
            };
        };

        function notifyProximity(bus) {
            console.log(getDistance(bus));
        };

        function getDistance(bus) {
            return busSpatialService.getDistance(bus.coords, vm.userMarker.coords);
        };

        function startTrip() {
        };
    };

})();
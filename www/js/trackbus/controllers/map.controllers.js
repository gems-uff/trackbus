(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation', '$stateParams',
        'stateService', 'busSpatialService',
        'busesPromise',
        'BUS', 'BUS_ICONS'
    ];

    function MapController(
        $scope, uiGmapGoogleMapApi, $cordovaGeolocation, $stateParams,
        stateService, busSpatialService,
        busesLinePromise,
        BUS, BUS_ICONS
    ) {
        var vm = this;
        var gmap;

        // Google Maps
        vm.busMarkers = [];
        vm.userMarker = {
            coords: {latitude: 0, longitude: 0},
            options: {icon: "img/person.png"}
        };
        vm.map = {
            center: {latitude: 0, longitude: 0},
            zoom: 10
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

        vm.lines = busesLinePromise;
        console.log(vm.lines);
        vm.selectedLine = $stateParams.line;

        vm.setCurrentPosition = setCurrentPosition;
        vm.notifyProximity = notifyProximity;
        vm.startTrip = startTrip;

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
            return mapSetup().then(function(){
                watchUserPosition();
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
            vm.busMarkers = [];
            angular.forEach(vm.lines, function(line) {
                angular.forEach(line, function(bus) {
                    addBusMarker(bus, lineIndex);
                });
                lineIndex++;
            });
        };

        function addBusMarker(bus, lineIndex) {
            //coords must contain latitude and longitude
            var marker = {
                id: bus[BUS.ORDER],
                options: {icon: BUS_ICONS[lineIndex]},
                coords: {
                    latitude: bus[BUS.LATITUDE],
                    longitude: bus[BUS.LONGITUDE]
                }
            };
            vm.busMarkers.push(marker);
            return marker;
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
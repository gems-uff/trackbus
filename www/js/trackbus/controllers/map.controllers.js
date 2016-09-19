(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation',
        'stateService',
        'busesPromise',
        'BUS'
    ];

    function MapController(
        $scope, uiGmapGoogleMapApi, $cordovaGeolocation,
        stateService,
        busesPromise,
        BUS
    ) {
        var vm = this;
        var buses = busesPromise;
        var baseRadius = 500;
        var gmap;

        // Google Maps
        vm.markers = [];
        vm.map = {
            center: {latitude: 0, longitude: 0},
            zoom: 10
        };
        vm.userCircle = {
            center: {
                latitude: 0,
                longitude: 0
            },
            radius: baseRadius * vm.map.zoom,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            }
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

        vm.setCurrentPosition = setCurrentPosition;
        vm.updateCircleRadius = updateCircleRadius;
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
            return mapSetup().then(initializeMarkers);
        };

        function updateCircleRadius(event) {
            vm.userCircle.radius = baseRadius/event.zoom;
            console.log(vm.userCircle.radius);
        };

        function setCurrentPosition(zoom) {
            return navigator.geolocation.getCurrentPosition(
                function success(result) {
                    var coords = result.coords;
                    vm.userCircle.center = {latitude: coords.latitude, longitude: coords.longitude};
                    setPosition(coords.latitude, coords.longitude, zoom);
                },
                function failure(result) {
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                });
        };

        function setPosition(latitude, longitude, zoom) {
            vm.map.refresh({
                latitude: latitude, longitude: longitude
            });
            if(zoom){
                vm.map.zoom = zoom;
            }
        };

        function initializeMarkers(){
            vm.markers = [];
            angular.forEach(buses, function(bus) {
                addMarker(bus);
            });
        };

        function addMarker(bus) {
            //coords must contain latitude and longitude
            var marker = {
                id: bus[BUS.ORDER],
                coords: {
                    latitude: bus[BUS.LATITUDE],
                    longitude: bus[BUS.LONGITUDE]
                }
            };
            vm.markers.push(marker);
            return marker;
        };

        function notifyProximity(bus) {
        };

        function startTrip() {
        };
    };

})();
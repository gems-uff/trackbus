(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = [
        'uiGmapGoogleMapApi', '$cordovaGeolocation',
        'stateService',
        'busesPromise',
        'BUS'
    ];

    function MapController(
        uiGmapGoogleMapApi, $cordovaGeolocation,
        stateService,
        busesPromise,
        BUS
    ) {
        var vm = this;
        var buses = busesPromise;
        var gmap;

        vm.markers = [];
        vm.map = {center: {latitude: 0, longitude: 0}};

        vm.userCircle = {
            center: {
                latitude: 0,
                longitude: 0
            },
            radius: 1000,
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
            position:"top-left"
        };

        vm.setCurrentPosition = setCurrentPosition;

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
    };

})();
(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('TripController', TripController);

    TripController.$inject = [
        '$q', '$rootScope', '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation',
        'busSpatialService', 'alertService',
        'stopsPromise',
        'BUS_STOP_ICON', 'ERROR_MESSAGES'
    ];

    function TripController(
        $q, $rootScope, $scope, uiGmapGoogleMapApi, $cordovaGeolocation,
        busSpatialService, alertService,
        stopsPromise,
        BUS_STOP_ICON, ERROR_MESSAGES
    ) {
        var vm = this;
        var notifyStops = [];

        vm.stops = stopsPromise;
        console.log(vm.stops);
        vm.addProximityListener = addProximityListener;
        vm.setPosition = setPosition;

        // Google Maps
        vm.stopsMarkers = [];
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

        activate();

        function activate() {
            function mapSetup(){
                return uiGmapGoogleMapApi.then(function(maps) {
                    return setCurrentPosition();
                });
            };

            return mapSetup().then(function(){
                return busSpatialService.watchPosition(setUserPosition).then(initializeStopsMarkers);
            });
        };

        function setCurrentPosition(zoom) {
            return busSpatialService.getCurrentPosition().then(
                function success(result) {
                    setUserPosition(result.latitude, result.longitude);
                    setPosition(result.latitude, result.longitude, zoom);
                },
                function error(result) {
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                }
            );
        };

        function setPosition(lat, lon, zoom) {
            console.log(lat,lon);
            vm.map.refresh({latitude: lat, longitude: lon});
            if(zoom){
                vm.map.zoom = zoom;
            }
        };

        function setUserPosition(lat, lon) {
            vm.userMarker.coords = {latitude: lat, longitude: lon};
        };

        function initializeStopsMarkers(){
            var result = [];
            vm.stopsMarkers = [];
            angular.forEach(vm.stops, function(stop) {
                result.push(generateStopMarker(stop));
            });
            vm.stopsMarkers = result;
        };

        function generateStopMarker(stop) {
            //must contain coords: {latitude: number, longitude: number}
            return {
                id: stop.sequencia,
                options: {icon: BUS_STOP_ICON},
                description: stop.descricao_ponto,
                coords: {
                    latitude: stop.latitude,
                    longitude: stop.longitude
                }
            };
        };

        function addProximityListener(stop) {
            notifyStops.push(stop);
            notifyProximity();
            alertService.showAlert("Notificação", SUCCESS_MESSAGES.STOPS_NOTIFICATION);
        };

        function notifyProximity() {
            angular.forEach(notifyStops, function(stop){
                if(getDistance(stop) <= TRACKBUS.STOP_NOTIFICATION_DISTANCE){
                    notificationService.scheduleStopNotification(stop);
                }
            });
        };

        function getDistance(stop) {
            var _stop = angular.copy(stop);
            if(!_stop.coords){
                _stop.coords = {
                    latitude: _stop.latitude,
                    longitude: _stop.longitude
                }
            }
            return busSpatialService.getDistance(_stop.coords, vm.userMarker.coords);
        };
    };

})();
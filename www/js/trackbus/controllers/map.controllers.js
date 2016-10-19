(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('MapController', MapController);

    MapController.$inject = [
        '$q', '$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation', '$stateParams', '$interval',
        'alertService', 'stateService', 'busSpatialService', 'busStateFactory', 'notificationService',
        'busesPromise',
        'BUS', 'BUS_ICONS', 'TRACKBUS', 'SUCCESS_MESSAGES'
    ];

    function MapController(
        $q, $scope, uiGmapGoogleMapApi, $cordovaGeolocation, $stateParams, $interval,
        alertService, stateService, busSpatialService, busStateFactory, notificationService,
        busesLinePromise,
        BUS, BUS_ICONS, TRACKBUS, SUCCESS_MESSAGES
    ) {
        var vm = this;
        var lines = busesLinePromise;
        var notifyBuses = [];
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
        vm.addProximityListener = addProximityListener;
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
                var deferred = $q.defer();
                navigator.geolocation.watchPosition(function(result){
                    var coords = result.coords;
                    setUserPosition(coords.latitude, coords.longitude);
                    deferred.resolve();
                });
                return deferred.promise;
            };
            function setUpdateInterval(){
                $interval(updateLines, TRACKBUS.TIME_TO_UPDATE);
            };

            return mapSetup().then(function(){
                getLinesIds();
                setUpdateInterval();
                watchUserPosition().then(initializeBusMarkers);
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
                notifyProximity();
            });
        };

        function notifyProximity() {
            angular.forEach(notifyBuses, function(bus){
                if(getDistance(bus) <= TRACKBUS.NOTIFICATION_DISTANCE){
                    notificationService.scheduleBusNotification(bus);
                }
            });
        };

        function setCurrentPosition(zoom) {
            return busSpatialService.getCurrentPosition().then(
                function success(result) {
                    var coords = result.coords;
                    setUserPosition(coords.latitude, coords.longitude);
                    setPosition(coords.latitude, coords.longitude, zoom);
                },
                function error(result) {
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                }
            );
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
                line: bus[BUS.LINE],
                distance: getDistance(bus).toFixed(2),
                coords: {
                    latitude: bus[BUS.LATITUDE],
                    longitude: bus[BUS.LONGITUDE]
                }
            };
        };

        function addProximityListener(bus){
            notifyBuses.push(bus);
            notifyProximity();
            alertService.showAlert("Notificação", SUCCESS_MESSAGES.BUS_NOTIFICATION);
        };

        function getDistance(bus) {
            if(!bus.coords){
                bus.coords = {
                    latitude: bus[BUS.LATITUDE],
                    longitude: bus[BUS.LONGITUDE]
                }
            }
            return busSpatialService.getDistance(bus.coords, vm.userMarker.coords);
        };

        function startTrip() {
        };
    };

})();
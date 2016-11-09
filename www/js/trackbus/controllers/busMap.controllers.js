(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('BusMapController', BusMapController);

    BusMapController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$interval',
        'alertService', 'stateService', 'spatialService', 'busStateFactory', 'notificationService', 'configService',
        'busesPromise', 'configPromise',
        'BUS', 'BUS_ICONS', 'PERSON_ICON', 'TRACKBUS', 'SUCCESS_MESSAGES', 'ERROR_MESSAGES'
    ];

    function BusMapController(
        $scope, uiGmapGoogleMapApi, $interval,
        alertService, stateService, spatialService, busStateFactory, notificationService, configService,
        busesLinePromise, configPromise,
        BUS, BUS_ICONS, PERSON_ICON, TRACKBUS, SUCCESS_MESSAGES, ERROR_MESSAGES
    ) {
        var vm = this;
        var lines = busesLinePromise;
        var notifyBuses = [];
        var options = configPromise;
        var updateWatch;

        // Google Maps
        vm.busMarkers = [];
        vm.userMarker = {
            coords: {latitude: 0, longitude: 0},
            options: {icon: PERSON_ICON}
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
        vm.goToTrip = stateService.trip;

        activate();

        function activate() {
            function mapSetup(){
                return uiGmapGoogleMapApi.then(function(maps) {
                    return setCurrentPosition();
                });
            };
            function setUpdateInterval(){
                updateWatch = $interval(updateLines, TRACKBUS.TIME_TO_UPDATE_LINES);
                $scope.$on('$destroy', function() {
                    $interval.cancel(updateWatch);
                });
            };

            options = configService.getPreferences();
            return mapSetup().then(function(){
                getLinesIds();
                setUpdateInterval();
                return spatialService.watchPosition(setUserPosition).then(initializeBusMarkers);
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
                if(getDistance(bus) <= options.notification.busDistance){
                    notificationService.scheduleBusNotification(bus);
                }
            });
        };

        function setCurrentPosition(zoom) {
            return spatialService.getCurrentPosition().then(
                function success(result) {
                    setPosition(result.latitude, result.longitude, zoom);
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
                    result.push(new BusMarker(bus, lineIndex));
                });
                lineIndex++;
            });
            vm.busMarkers = result;
        };

        function BusMarker(bus, lineIndex) {
            //must contain coords: {latitude: number, longitude: number}
            this.id = bus[BUS.ORDER],
            this.options = {icon: BUS_ICONS[lineIndex]},
            this.line = bus[BUS.LINE],
            this.distance = getDistance(bus).toFixed(2),
            this.coords = {
                latitude: bus[BUS.LATITUDE],
                longitude: bus[BUS.LONGITUDE]
            }
        };

        function addProximityListener(bus){
            notifyBuses.push(bus);
            notifyProximity();
            alertService.showAlert("Notificação", SUCCESS_MESSAGES.BUS_NOTIFICATION);
        };

        function getDistance(bus) {
            var _bus = angular.copy(bus);
            if(!_bus.coords){
                _bus.coords = {
                    latitude: _bus[BUS.LATITUDE],
                    longitude: _bus[BUS.LONGITUDE]
                }
            }
            return spatialService.getDistance(_bus.coords, vm.userMarker.coords);
        };
    };

})();
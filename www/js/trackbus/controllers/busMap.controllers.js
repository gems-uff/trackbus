(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('BusMapController', BusMapController);

    BusMapController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$interval',
        'alertService', 'stateService', 'spatialService',
        'busStateFactory', 'notificationService', 'configService',
        'busesPromise', 'configPromise',
        'BUS', 'BUS_ICONS', 'PERSON_ICON', 'TRACKBUS', 'SUCCESS_MESSAGES', 'ERROR_MESSAGES'
    ];

    function BusMapController(
        $scope, uiGmapGoogleMapApi, $interval,
        alertService, stateService, spatialService,
        busStateFactory, notificationService, configService,
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
        vm.selectedMarker = {};
        vm.userMarker = {
            coords: {latitude: 0, longitude: 0},
            options: {icon: PERSON_ICON}
        };
        vm.map = {
            center: {latitude: 0, longitude: 0},
            zoom: 15
        };
        vm.onMarkerClick = onMarkerClick;
        vm.onWindowClose = onWindowClose;
        vm.showMarker = false;
        // Google Maps

        vm.linesIds = [];

        vm.setCurrentPosition = setCurrentPosition;
        vm.addProximityListener = addProximityListener;
        vm.goToTrip = stateService.trip;
        vm.centerMap = centerMap;

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
            function enableBackground() {
                if(window.cordova){
                    cordova.plugins.backgroundMode.setDefaults({
                        title: "Trackbus",
                        text: "Observando localização dos ônibus.",
                    });
                    cordova.plugins.backgroundMode.enable();
                    $scope.$on("$destroy", function() {
                        cordova.plugins.backgroundMode.disable();
                    });
                }
            };

            enableBackground();
            return mapSetup().then(function(){
                vm.linesIds = getLinesIds();
                setUpdateInterval();
                return spatialService.watchPosition(setUserPosition).then(initializeBusMarkers);
            });
        };

        function getLinesIds() {
            var arr = [];
            angular.forEach(lines, function(line) {
                arr.push(line[0][BUS.LINE]);
            });
            return arr;
        };

        function updateLines(){
            return busStateFactory.mapState(vm.linesIds).then(function(result){
                lines = result;
                getLinesIds();
                initializeBusMarkers();
                notifyProximity();
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

        function setPosition(lat, lng, zoom) {
            vm.map.refresh({latitude: lat, longitude: lng});
            if(zoom){
                vm.map.zoom = zoom;
            }
        };

        function setUserPosition(lat, lng) {
            vm.userMarker.coords = {latitude: lat, longitude: lng};
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
            //must contain latitude: Number, longitude: Number
            this.id = bus[BUS.ORDER],
            this.options = {icon: BUS_ICONS[lineIndex]},
            this.line = bus[BUS.LINE],
            this.distance = getDistance(bus).toFixed(2),
            this.coords = {
                latitude: bus[BUS.LATITUDE],
                longitude: bus[BUS.LONGITUDE]
            }
        };

        function indexOfBus(bus) {
            var index = -1;
            angular.forEach(notifyBuses, function(b, key) {
                if(bus[BUS.ORDER] ==  b[BUS.ORDER]){
                    return index = key;
                }
            });
            return index;
        };

        function addProximityListener(bus){
            notifyBuses.push(bus);
            notifyProximity();
            alertService.showAlert("Notificação", SUCCESS_MESSAGES.BUS_NOTIFICATION);
        };

        function removeProximityListener(bus, index) {
            var idx = index ? index:indexOfBus(bus);
            if(idx != -1){
                notifyBuses.splice(idx, 1);
            }
        };

        function notifyProximity() {
            angular.forEach(notifyBuses, function(bus){
                if(getDistance(bus) <= options.notification.busDistance){
                    notificationService.scheduleBusNotification(bus);
                    removeProximityListener(bus);
                }
            });
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

        function centerMap() {
            setPosition(vm.userMarker.coords.latitude, vm.userMarker.coords.longitude);
        };

        function onMarkerClick(trigger) {
            vm.selectedMarker = trigger.model;
            vm.showMarker = true;
        };

        function onWindowClose() {
            vm.showMarker = false;
        };
    };

})();
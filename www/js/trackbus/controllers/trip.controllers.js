(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('TripController', TripController);

    TripController.$inject = [
        '$scope', 'uiGmapGoogleMapApi', '$interval', '$location', '$anchorScroll',
        'spatialService', 'alertService', 'stopService', 'notificationService',
        'stopsPromise', 'configPromise', 'touristPromise',
        'PERSON_ICON', 'BUS_STOP_ICON', 'TOURIST_STOP_ICON',
        'TRACKBUS', 'SUCCESS_MESSAGES', 'ERROR_MESSAGES'
    ];

    function TripController(
        $scope, uiGmapGoogleMapApi, $interval, $location, $anchorScroll,
        spatialService, alertService, stopService, notificationService,
        stopsPromise, configPromise, touristPromise,
        PERSON_ICON, BUS_STOP_ICON, TOURIST_STOP_ICON,
        TRACKBUS, SUCCESS_MESSAGES, ERROR_MESSAGES
    ) {
        var vm = this;
        var notifyStops = [];
        var notifyTourist = [];
        var options = configPromise;
        var updateWatch;
        var currentStop;

        vm.stops = stopsPromise;
        vm.touristSpots = options.tourist.enable ? touristPromise:[];
        vm.addStopProximityListener = addStopProximityListener;
        vm.addTouristProximityListener = addTouristProximityListener;
        vm.setPosition = setPosition;
        vm.centerMap = centerMap;
        vm.backToTop = backToTop;

        // Google Maps
        vm.stopsMarkers = [];
        vm.touristMarkers = [];
        vm.selectedStopMarker = {};
        vm.selectedTouristMarker = {};
        vm.userMarker = {
            coords: {latitude: 0, longitude: 0},
            options: {icon: PERSON_ICON}
        };
        vm.map = {
            center: {latitude: 0, longitude: 0},
            zoom: 15
        };
        vm.onStopMarkerClick = onStopMarkerClick;
        vm.onTouristMarkerClick = onTouristMarkerClick;
        vm.onStopWindowClose = onStopWindowClose;
        vm.onTouristWindowClose = onTouristWindowClose;
        vm.showTouristMarker = false;
        vm.showStopMarker = false;
        // Google Maps

        activate();

        function activate() {
            function mapSetup(){
                return uiGmapGoogleMapApi.then(function(maps) {
                    return setCurrentPosition();
                });
            };
            function setUpdateInterval() {
                if(options.precisionMode){
                    updateWatch = $interval(notifyProximity, TRACKBUS.TIME_TO_UPDATE_STOPS);
                } else {
                    updateWatch = $interval(alternativeNotifyProximity, TRACKBUS.TIME_TO_UPDATE_STOPS);
                }
                $scope.$on('$destroy', function() {
                    $interval.cancel(updateWatch);
                });
            };
            function enableBackground() {
                if(window.cordova){
                    cordova.plugins.backgroundMode.setDefaults({
                        title: "Trackbus",
                        text: "Observando localização dos pontos.",
                    });
                    cordova.plugins.backgroundMode.enable();
                    $scope.$on("$destroy", function() {
                        cordova.plugins.backgroundMode.disable();
                    });
                }
            };

            enableBackground();
            vm.stops = stopService.sortStops(vm.stops);
            return mapSetup().then(function(){
                setUpdateInterval();
                initializeStopsMarkers();
                initializeTouristMarkers();
                return spatialService.watchPosition(watchUserPosition);
            });
        };

        function getNextStop() {
            var stops = vm.stops.filter(function(s) {
                return Number(s.sequencia) === (Number(currentStop.sequencia) + 1);
            });
            return stopService.getClosestStop(stops, vm.userMarker.coords);
        };

        function setCurrentPosition(zoom) {
            return spatialService.getCurrentPosition().then(
                function success(result) {
                    var coords = {latitude: result.latitude, longitude: result.longitude};
                    setPosition(coords, zoom);
                },
                function error(result) {
                    console.error(result);
                    alertService.showAlert("Erro", ERROR_MESSAGES.NAVIGATOR_FAILURE);
                }
            );
        };

        function updateCurrentStop() {
            currentStop = stopService.getClosestStop(vm.stops, vm.userMarker.coords);
        };

        function watchUserPosition(lat, lng){
            var coords = {latitude: lat, longitude: lng}
            if(!currentStop){
                updateCurrentStop();
            }
            setUserPosition(coords);
            options.precisionMode ? notifyProximity():alternativeNotifyProximity();
        };

        function scrollToMap() {
            $location.hash('map-div');
            $anchorScroll();
        };

        function backToTop() {
            $location.hash('top');
            $anchorScroll();
        };

        function setPosition(coords, zoom) {
            scrollToMap();
            vm.map.refresh({latitude: coords.latitude, longitude: coords.longitude});
            if(zoom){
                vm.map.zoom = zoom;
            }
        };

        function setUserPosition(coords) {
            vm.userMarker.coords = coords;
        };

        function initializeStopsMarkers(){
            var result = [];
            vm.stopsMarkers = [];
            angular.forEach(vm.stops, function(stop) {
                result.push(new StopMarker(stop));
            });
            vm.stopsMarkers = result;
        };

        function initializeTouristMarkers(){
            var result = [];
            vm.touristMarkers = [];
            angular.forEach(vm.touristSpots, function(ts) {
                result.push(new TouristMarker(ts));
            });
            vm.touristMarkers = result;
        };

        function StopMarker(stop){
            //must contain latitude: Number, longitude: Number
            this.id = stop.sequencia;
            this.options = {icon: BUS_STOP_ICON};
            this.description = stop.descricao_ponto;
            this.distance = 0;
            this.coords = {
                latitude: stop.latitude,
                longitude: stop.longitude
            };
        };

        function TouristMarker(ts){
            //must contain latitude: Number, longitude: Number
            this.id = ts.nome;
            this.options = {icon: TOURIST_STOP_ICON};
            this.address = ts.endereco;
            this.distance = 0;
            this.coords = {
                latitude: ts.latitude,
                longitude: ts.longitude
            };
        };

        function indexOf(array, attr, value) {
            var index = -1;
            angular.forEach(array, function(element, key) {
                if(element[attr] ==  value){
                    return index = key;
                }
            });
            return index;
        };

        function addProximityListener(array, value, message) {
            if(array.contains(value)){
                alertService.showAlert("Erro", ERROR_MESSAGES.STOP_ALREADY_NOTIFYING);
                return;
            }
            array.push(value);
            updateCurrentStop();
            options.precisionMode ? notifyProximity():alternativeNotifyProximity();
            alertService.showAlert("Notificação", message);
        };

        function removeProximityListener(array, attr, value, index) {
            var idx = index ? index:indexOf(array, attr, value);
            if(idx != -1){
                return array.splice(idx, 1);
            }
            return array;
        };

        function addStopProximityListener(stop) {
            addProximityListener(notifyStops, stop, SUCCESS_MESSAGES.STOP_NOTIFICATION);
        };

        function addTouristProximityListener(ts) {
            addProximityListener(notifyTourist, ts, SUCCESS_MESSAGES.TOURIST_NOTIFICATION);
        };

        function removeStopProximityListener(stop, index) {
            removeProximityListener(notifyStops, "description", stop.descricao_ponto, index);
        };

        function removeTouristProximityListener(ts, index){
            removeProximityListener(notifyTourist, "id", ts.id, index);
        };

        function notifyProximity() {
            var nextStop = getNextStop();
            if(!nextStop){
                return;
            }

            var distance = getDistance(nextStop);
            var idx;
            notifyTouristSpots(currentStop.pontos_turisticos);
            if(distance <= options.notification.stopDistance){
                idx = indexOf(notifyStops, "description", nextStop.descricao_ponto);
                if(idx != -1){
                    nextStop.distance = distance;
                    notificationService.scheduleStopNotification(nextStop);
                    removeStopProximityListener(nextStop, idx);
                }
                currentStop = nextStop;
            }
        };

        function alternativeNotifyProximity() {
            var distance;
            var idx;
            var stop;
            angular.forEach(notifyStops, function(s){
                idx = indexOf(vm.stops, "descricao_ponto", s.description);
                stop = vm.stops[idx];
                distance = getDistance(stop);
                notifyTouristSpots(stop);
                if(distance <= options.notification.stopDistance){
                    stop.distance = distance;
                    notificationService.scheduleStopNotification(stop);
                    removeStopProximityListener(stop);
                }
            });
        };

        function notifyTouristSpots(touristSpots) {
            function find(array, attr, value){
                var result;
                angular.forEach(array, function(e){
                    if(e[attr] === value){
                        return result = e;
                    }
                })
                return result;
            };

            var spot;
            var idx;
            angular.forEach(touristSpots, function(ts) {
                if(ts.distancia <= options.notification.touristDistance){
                    idx = indexOf(notifyTourist, "name", ts.name);
                    if(idx != -1){
                        spot = notifyTourist[idx];
                        spot.distance = ts.distancia;
                        notificationService.scheduleTouristNotification(spot);
                        removeTouristProximityListener(spot, idx);
                    }
                }
            });
        };

        function getDistance(point) {
            var _point = angular.copy(point);
            if(!_point.coords){
                _point.coords = {
                    latitude: _point.latitude,
                    longitude: _point.longitude
                }
            }
            return spatialService.getDistance(_point.coords, vm.userMarker.coords);
        };

        function centerMap() {
            setPosition(vm.userMarker.coords);
        };

        function onStopMarkerClick(trigger) {
            vm.selectedStopMarker = trigger.model;
            vm.showStopMarker = true;
        };

        function onTouristMarkerClick(trigger) {
            vm.selectedTouristMarker = trigger.model;
            vm.showTouristMarker = true;
        };

        function onStopWindowClose() {
            vm.showStopMarker = false;
        };

        function onTouristWindowClose() {
            vm.showTouristMarker = false;
        };

    };

})();
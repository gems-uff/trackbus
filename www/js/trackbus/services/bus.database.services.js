(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('busDbFactory', busDbFactory);

    busDbFactory.$inject = ['$q', 'DB', 'busFactory', 'BUS'];

    function busDbFactory($q, DB, busFactory, BUS) {

        var self = this;

        self.listBuses = function() {
            return DB.query(
                "SELECT * " +
                "FROM bus "
            ).then(DB.fetchAll);
        };

        self.deleteBuses = function() {
            return DB.query(
                "DELETE " +
                "FROM bus"
            );
        };

        self.createBus = function(bus) {
            return DB.query(
                "INSERT INTO bus(" +
                "datetime, bus_order, " +
                "line, latitude, " +
                "longitude, speed, " +
                "direction) " +
                "VALUES (?,?,?,?,?,?,?)",
                [
                    bus[BUS.DATETIME], bus[BUS.ORDER],
                    bus[BUS.LINE], bus[BUS.LATITUDE],
                    bus[BUS.LONGITUDE], bus[BUS.SPEED],
                    bus[BUS.DIRECTION]
                ]
            );
        };

        self.createBuses = function(buses) {
            var queries = [];
            angular.forEach(buses, function(bus) {
                queries.push(
                    {
                        query: "INSERT INTO bus(" +
                                "datetime, bus_order, " +
                                "line, latitude, " +
                                "longitude, speed, " +
                                "direction) " +
                                "VALUES (?,?,?,?,?,?,?)",
                        bindings: [
                            bus[BUS.DATETIME], bus[BUS.ORDER],
                            bus[BUS.LINE], bus[BUS.LATITUDE],
                            bus[BUS.LONGITUDE], bus[BUS.SPEED],
                            bus[BUS.DIRECTION]
                        ]
                    }
                );
            });
            return DB.transaction(queries);
        };

        self.getDistance = function(bus, coordinates) {
            return DB.query(
                "SELECT Distance(?,?) " +
                "FROM bus ", [bus.coords, coordinates]
            );
        };

        return self;
    };

})();

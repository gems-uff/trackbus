(function() {
    'use strict';

    angular
        .module('database')
        .factory('DB', DB);

    DB.$inject = ['$q', 'DB_CONFIG'];

    function DB($q, DB_CONFIG) {

        var self = this;
        self.db = null;

        self.init = function() {
            var promises = [];

            function open(){
                if(window.cordova){
                    self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name, location:'default'}, initialize);
                } else {
                    self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'tbdb', -1);
                    initialize();
                }
            };

            function initialize(){
                angular.forEach(DB_CONFIG.tables, function(table) {
                    var columns = [];

                    angular.forEach(table.columns, function(column) {
                        columns.push(column.name + ' ' + column.type);
                    });

                    var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                    promises.push(self.query(query));
                    console.log('Table ' + table.name + ' initialized');
                });
            };

            open();
            return $q.all(promises);
        };

        self.query = function(query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();
            self.db.transaction(function(transaction) {
                transaction.executeSql(query, bindings, function(transaction, result) {
                    deferred.resolve(result);
                }, function(transaction, error) {
                    deferred.reject(error);
                    console.error(error, query);
                });
            });
            return deferred.promise;
        };

        self.transaction = function(queries) {
            //Expects each query object to contain a query and array of bindings
            var deferred = $q.defer();
            self.db.transaction(function(transaction) {
                angular.forEach(queries, function(q){
                    q.bindings = typeof q.bindings !== 'undefined' ? q.bindings : [];
                    transaction.executeSql(q.query, q.bindings, function(transaction, result) {
                        deferred.resolve(result);
                    }, function(transaction, error) {
                        deferred.reject(error);
                        console.error(error, query);
                    });
                });
            });
            return deferred.promise;
        };

        self.fetchAll = function(result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };

        self.fetchAllAsObject = function(result, constructor) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(new constructor(result.rows.item(i)));
            }

            return output;
        };

        self.fetchAsObject = function(result, constructor) {
            return new constructor(self.fetch(result));
        };

        self.fetch = function(result) {
            return result.rows.item(0);
        };

        return self;
    }
})();

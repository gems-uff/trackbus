(function() {
    'use strict';

    angular
        .module('database')
        .constant('DB_CONFIG', {
        name: 'tbdb',
        tables: [
            {
                name: 'bus',
                columns: [
                    {name: 'id', type: 'int primary key'},
                    {name: 'datetime', type: 'text'},
                    {name: 'bus_order', type: 'text'}, //order is reserved
                    {name: 'line', type: 'text'},
                    {name: 'latitude', type: 'text'},
                    {name: 'longitude', type: 'text'},
                    {name: 'speed', type: 'text'},
                    {name: 'direction', type: 'text'}
                ]
            }
        ]
    });
})();
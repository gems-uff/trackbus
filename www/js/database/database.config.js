(function() {
    'use strict';

    angular
        .module('database')
        .constant('DB_CONFIG', {
        name: 'db_name',
        tables: [
            {
                name: 'user',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'email', type: 'text unique'},
                    {name: 'name', type: 'text'},
                    {name: 'phone', type: 'text'},
                    {name: 'created_at', type: 'text default CURRENT_TIMESTAMP'},
                    {name: 'updated_at', type: 'text default CURRENT_TIMESTAMP'}
                ]
            }
        ]
    });
})();
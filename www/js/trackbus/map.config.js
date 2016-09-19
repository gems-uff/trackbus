(function() {
    'use strict';

    angular
        .module('trackbus')
        .config(config);

    config.$inject = ['uiGmapGoogleMapApiProvider'];

    function config(uiGmapGoogleMapApiProvider){
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyC_1IqLqMKj2ar5evRVlOl4vVuWTO5Eqzw',
            libraries: 'places'
        });
    };

})();
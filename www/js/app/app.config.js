(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$ionicConfigProvider'];

    function config($ionicConfigProvider){
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.views.maxCache(0); //how many views will be cached
    };

})();
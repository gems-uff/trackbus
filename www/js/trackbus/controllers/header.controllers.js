(function() {
    'use strict';

    angular
        .module('trackbus')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [];

    function HeaderController() {
        var vm = this;

        activate();

        function activate() {
        };
    };

})();
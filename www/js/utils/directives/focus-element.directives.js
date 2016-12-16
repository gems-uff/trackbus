(function() {
    'use strict';

    angular
        .module('utils')
        .directive('focusElement', focusElement);

    focusElement.$inject = ['$window', '$timeout'];

    function focusElement($window, $timeout) {
        return function(scope, elem, attr) {
            elem.on('click', function() {
                $timeout(function() {
                    $window.document.getElementById(attr.focusElement).focus();
                })
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function() {
                elem.off('click');
            });
        };
    };

})();
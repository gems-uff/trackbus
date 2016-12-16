(function() {
    'use strict';

    angular
        .module('utils')
        .directive('scrollTo', scrollTo);

    scrollTo.$inject = ['$anchorScroll'];

    function scrollTo($anchorScroll) {
        return function(scope, elem, attr) {
            elem.on('click', function() {
                $anchorScroll(attr.scrollTo);
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function() {
                elem.off('click');
            });
        };
    };

})();
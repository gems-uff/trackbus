(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('textToSpeechService', textToSpeechService);

    textToSpeechService.$inject = ['$q'];

    function textToSpeechService($q) {

        var self = this;

        self.speak = function(text) {
            var deferred = $q.defer();
            var speakOptions = {
                text: text,
                locale: 'pt-BR',
                rate: 1
            };

            TTS.speak(speakOptions, function () {
                deferred.resolve();
            }, function (reason) {
                console.error(reason);
                deferred.reject(reason);
            });

            return deferred.promise;
        };

        return self;
    };

})();

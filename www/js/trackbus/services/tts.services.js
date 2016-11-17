(function() {
    'use strict';

    angular
        .module('trackbus')
        .factory('textToSpeechService', textToSpeechService);

    textToSpeechService.$inject = ['$q'];

    function textToSpeechService($q) {

        var self = this;

        self.speak = function(text) {
            console.log(text);
            var deferred = $q.defer();
            var speakOptions = {
                text: text,
                locale: 'pt-BR',
                rate: 1
            };

            TTS.speak(speakOptions, function () {
                console.log("success");
                deferred.resolve();
            }, function (reason) {
                console.log(reason);
                deferred.reject(reason);
            });

            return deferred.promise;
        };

        return self;
    };

})();

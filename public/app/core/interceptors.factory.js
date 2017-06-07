(function() {
    'use strict';

    angular
        .module('app.interceptors', ['app.token'])
        .factory('InterceptorsFactory', InterceptorsFactory);

    function InterceptorsFactory(TokenFactory) {
        var service = {
            request: request
        };

        return service;

        function request(config) {

            var token = TokenFactory.getToken();

            if (token) config.headers['x-access-token'] = token;

            return config
        };

    };
})();
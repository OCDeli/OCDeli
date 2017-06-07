(function() {
    'use strict';

    angular
        .module('app.token', [])
        .factory('TokenFactory', TokenFactory);

    function TokenFactory($window) {
        var service = {
            setToken: setToken,
            getToken: getToken
        };

        return service;

        function setToken(token) {
            if (token) {
                $window
                    .localStorage
                        .setItem('token', token);
            } else {
                $window
                    .localStorage
                        .removeItem('token');
            }
        };

        function getToken() {
            return $window
                .localStorage
                    .getItem('token');
        };

    }
})();

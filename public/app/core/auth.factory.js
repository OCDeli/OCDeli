(function() {
    'use strict';

    angular
        .module('app.auth', ['app.token'])
        .factory('AuthFactory', AuthFactory);

    function AuthFactory($http, TokenFactory) {
        var service = {
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout,
            getUser: getUser
        };

        return service;

        function login(loginData) {
            return $http
                .post('/api/authenticate', loginData)
                .then(function(data) {
                    TokenFactory
                        .setToken(data.data.token);
                    return data;
                });
        };

        function isLoggedIn() {
            if (TokenFactory.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        function getUser() {
            if (TokenFactory.getToken()) {
                return $http
                    .post('/api/currentuser');
            } else {
                $q.reject({ message: 'user has no token '});
            }
        };

        function logout() {
            TokenFactory
                .setToken();
        };

    }
})();

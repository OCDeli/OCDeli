(function() {
    'use strict';

    angular
        .module('app.user', [])
        .factory('UserFactory', UserFactory);

    function UserFactory($http) {
        var service = {
            create: create
        };

        return service;

        function create(regData) {
            return $http
                .post('/api/users', regData)
        }
    }
})();
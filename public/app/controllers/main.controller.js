(function() {
    'use strict';

    angular
        .module('app.main', ['app.auth', 'app.token','app.interceptors'])
        .controller('MainController', MainController);

    function MainController($http, $timeout, $location, AuthFactory, TokenFactory, InterceptorsFactory, $rootScope) {
        var vm = this;

        vm.loadMe = false;

        $rootScope.$on('$routeChangeStart', function() {
            if (AuthFactory.isLoggedIn()) {
                // console.log('success: user is logged in');
                vm.isLoggedIn = true;
                AuthFactory
                    .getUser()
                    .then(function(data) {
                        // console.log(data.data.username)
                        vm.username = data.data.username;
                        vm.useremail = data.data.email;
                        vm.loadMe = true;
                    });
            } else {
                // console.log('failure: user is NOT logged in')
                vm.isLoggedIn = false;
                vm.username = '';
                vm.loadMe = true;
            }
        });

        vm.doLogin = function(loginData) {
            vm.loading = true;
            vm.errorMessage = false;

            AuthFactory
                .login(vm.loginData)
                .then(function(data) {
                    if (data.data.success) {
                        vm.loading = false;
                        vm.successMessage = data.data.message;
                        $timeout(function() {
                            $location
                                .path('/');
                            vm.loginData = '';
                            vm.successMessage = false;
                        }, 1000);
                    } else {
                        vm.loading = false;
                        vm.errorMessage = data.data.message;
                    }
                });
        };

        vm.logout = function() {
            AuthFactory
                .logout();
            $location
                .path('/logout')
            $timeout(function() {
                $location
                    .path('/')
            }, 1000);
        };
    };
})();
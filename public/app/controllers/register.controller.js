(function() {
    'use strict';

    angular
        .module('app.reg', ['app.user'])
        .controller('RegisterController', RegisterController)

    function RegisterController($http, $location, $timeout, UserFactory) {
        var vm = this;

        vm.regUser = function(regData) {
            vm.loading = true;
            vm.errorMessage = false;
            // console.log('form submitted');
            // console.log(vm.regData)
           UserFactory
                .create(vm.regData)
                .then(function(data) {
                    console.log(data.data.success);
                    console.log(data.data.message);
                    if (data.data.success) {
                        vm.loading = false;
                        // create success message
                        vm.successMessage = data.data.message + ' ...redirecting';
                        // redirect to home page with 1 second delay
                        $timeout(function() {
                            $location.path('/');
                        }, 1000);
                    } else {
                        vm.loading = false;
                        // create an error message
                        vm.errorMessage = data.data.message;
                    }
                });
        };
    };
})();
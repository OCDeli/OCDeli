angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'RegisterController',
        controllerAs: 'regCtrl',
        authenticated: false
    })
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })
    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    })
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })
    .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    }); 
})

.run(['$rootScope','AuthFactory', '$location', function($rootScope, AuthFactory, $location) {
    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {


        if (next.$$route.authenticated == true) {
            if (!AuthFactory.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        } else if (next.$$route.authenticated == false) {
            if (AuthFactory.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile')
            }
        }
        // console.log(AuthFactory.isLoggedIn());

        // console.log(next.$$route.authenticated);
    });
}]);
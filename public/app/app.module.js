angular.module('app', ['app.routes', 'app.reg', 'app.main'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('InterceptorsFactory');
});


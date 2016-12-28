/**
 * Created by Khoa on 12/27/2016.
 */

const app = angular.module("app", ['ngRoute']);

// app.config(($locationProvider, $routeProvider) => {
//    $routeProvider
//        .when('/', { templateUrl: 'partials/index' })
//        .when('/about', { templateUrl: 'partials/about' })
//        .otherwise({ redirectTo: '/' });
// });

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/index'
        })
        .when('/about', {
            templateUrl: 'partials/about'
        })
        .otherwise({
           redirectTo: '/'
        });
}]);

app.controller('MainCtrl', ($scope) => {
   $scope.hello = "asdl;fkj";
});
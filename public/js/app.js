/**
 * Created by Khoa on 12/27/2016.
 */

const app = angular.module("app", ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    //default route
    $urlRouterProvider.otherwise("/");
    
    //routes
    $stateProvider.state("main",{
            url: "/",
            templateUrl: "partials/index"
        })
        .state("about", {
            url: "/about",
            templateUrl: "partials/about"
        });
}]);

app.controller('MainCtrl', function($scope) {
   $scope.hello = "asdl;fkj";
});
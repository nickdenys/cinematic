'use strict';

var cinematic = angular.module('cmApp', [
    'ngRoute',
    'smoothScroll',
    'cmApp.controllers',
    'cmApp.services',
    'cmApp.directives',
    'cmApp.filters',
    'cmApp.models',
  ])
  .config(['$routeProvider', function($routeProvider) {

    // Handle routing URLs

    $routeProvider.when('/', {
      templateUrl: 'views/intro.html',
      controller: 'cmApp.controllers.IntroCtrl'
    });

    $routeProvider.when('/search', {
        templateUrl:'views/search.html',
        controller:'cmApp.controllers.SearchCtrl'
    });


    $routeProvider.otherwise({redirectTo: '/'});
}]);
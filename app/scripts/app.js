'use strict';

var cinematic = angular.module('cmApp', [
    'ngRoute',
    'smoothScroll',
    'cmApp.controllers',
    'cmApp.services',
    'cmApp.directives',
    'cmApp.filters',
    'cmApp.models',
    'LocalStorageModule'
  ])
  .config(['$routeProvider','localStorageServiceProvider', function($routeProvider, localStorageServiceProvider) {

    // Handle routing URLs

    $routeProvider.when('/', {
      templateUrl: 'views/intro.html',
      controller: 'cmApp.controllers.IntroCtrl'
    });

    $routeProvider.when('/search', {
        templateUrl:'views/search.html',
        controller:'cmApp.controllers.SearchCtrl'
    });

    $routeProvider.when('/discover/movie', {
      templateUrl:'views/discover.movie.html',
      controller:'cmApp.controllers.DiscoverMovieCtrl'
    });

    /*$routeProvider.when('/discover/tv', {
      templateUrl:'views/discover.tv.html',
      controller:'cmApp.controllers.DiscoverTvCtrl'
    });*/

    $routeProvider.otherwise({redirectTo: '/'});

    // Configure LocalStorage settings
    localStorageServiceProvider
      .setPrefix('cmApp')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
  }]);
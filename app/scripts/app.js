'use strict';

var cinematic = angular.module('cmApp', [
    'ngRoute',
    'ngAnimate',
    'smoothScroll',
    'cmApp.controllers',
    'cmApp.services',
    'cmApp.directives',
    'cmApp.filters',
    'cmApp.models',
    'LocalStorageModule',
    'selectize',
    'rzModule'
  ])
  .config(['$routeProvider','localStorageServiceProvider', function($routeProvider, localStorageServiceProvider) {

    // Handle routing URLs

    $routeProvider.when('/', {
      templateUrl: 'views/intro.html',
      controller: 'cmApp.controllers.IntroCtrl'
    });

    $routeProvider.when('/movie/', {
      templateUrl:'views/movie.html',
    });

    $routeProvider.when('/movie/search', {
        templateUrl:'views/movie.search.html',
        controller:'cmApp.controllers.MovieSearchCtrl'
    });

    $routeProvider.when('/movie/discover', {
      templateUrl:'views/movie.discover.html',
      controller:'cmApp.controllers.DiscoverMovieCtrl'
    });

    /*$routeProvider.when('/tv/discover', {
      templateUrl:'views/tv.discover.html',
      controller:'cmApp.controllers.TvDiscoverCtrl'
    });*/

    $routeProvider.otherwise({redirectTo: '/'});

    // Configure LocalStorage settings
    localStorageServiceProvider
      .setPrefix('cmApp')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
  }]);
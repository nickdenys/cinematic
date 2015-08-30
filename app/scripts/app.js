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
    'rzModule',
    'oauth'
  ])
  .config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {

    // Handle routing URLs
    $routeProvider.when('/', {
      templateUrl: 'views/intro.html',
      controller: 'cmApp.controllers.IntroCtrl'
    });

    $routeProvider.when('/test', {
      templateUrl: 'views/test.html',
      controller: 'cmApp.controllers.TestCtrl'
    });

    $routeProvider.when('/movie/', {
      templateUrl:'views/movie.html'
    });

    $routeProvider.when('/movie/search', {
        templateUrl:'views/movie.search.html',
        controller:'cmApp.controllers.MovieSearchCtrl'
    });

    $routeProvider.when('/movie/discover', {
      templateUrl:'views/movie.discover.html',
      controller:'cmApp.controllers.MovieDiscoverCtrl'
    });

    $routeProvider.when('/dashboard', {
      templateUrl:'views/dashboard.html',
      controller:'cmApp.controllers.DashboardCtrl'
    });

    // Catch access token without HTML5 mode
    $routeProvider.when('/access_token=:accessToken', {
      template: '',
      controller: function ($location, AccessToken) {
        var hash = $location.path().substr(1);
        AccessToken.setTokenFromString(hash);
        $location.path('/');
        $location.replace();
      }
    });

    $routeProvider.otherwise({redirectTo: '/'});


    // Configure LocalStorage settings
    localStorageServiceProvider
      .setPrefix('cmApp')
      .setStorageType('sessionStorage')
      .setNotify(true, true);

  }]);
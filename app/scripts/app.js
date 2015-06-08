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

    $routeProvider.when('/search', {
        templateUrl:'views/search.html',
        controller:'cmApp.controllers.SearchCtrl'
    });

    $routeProvider.when('/discover/movie', {
      templateUrl:'views/discover.movie.html',
      controller:'cmApp.controllers.DiscoverMovieCtrl'
    });

    $routeProvider.when('/discover/movie/:questionNo', {
      templateUrl:'views/discover.movie.html',
      controller:'cmApp.controllers.DiscoverMovieCtrl'
      /*resolve: {
        movieQuestion: ['$route', '$q', 'cmApp.services.QuestionSrvc', function($route, $q, QuestionSrvc) {
          var deferred = $q.defer();
          QuestionSrvc.getMovieQuestion().then(
            function(data){
              deferred.resolve(data);
              console.log(data);
            },
            function(error){
              deferred.reject(error);
              console.log('error')
            }
          );

          return deferred.promise;
        }]
      }*/
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
(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.MovieWatchlistCtrl', ['$rootScope','$scope', '$http','$routeParams','$location', 'cmApp.services.TraktSrvc', function($rootScope, $scope, $http, $routeParams, $location, TraktSrvc) {

    /*------------------------------------*\
        #DATA
    \*------------------------------------*/

    $scope.watchlist = {};
    $scope.watchlist = TraktSrvc.getMovieWatchlist();
    console.log($scope.watchlist);



  }]);

  /*------------------------------------*\
      #HELPERS
  \*------------------------------------*/



})();
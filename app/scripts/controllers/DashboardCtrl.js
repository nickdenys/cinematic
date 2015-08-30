(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.DashboardCtrl', ['$rootScope','$scope', '$http','$routeParams','$location', 'cmApp.services.TraktSrvc', function($rootScope, $scope, $http, $routeParams, $location, TraktSrvc) {

    /*------------------------------------*\
        #DATA
    \*------------------------------------*/

    $scope.data = {};

    /*------------------------------------*\
        #FUNCTIONS
    \*------------------------------------*/

    $scope.getUserLists = function(){
      if(!$scope.data.userlists){
        TraktSrvc.fetchUserLists().
          then(function(){
            $scope.data.userlists = TraktSrvc.getUserLists();
          });
      }
    };

    $scope.getWatchList = function(){
      $scope.currentListId = "watchlist";
      TraktSrvc.fetchMovieWatchlist().
        then(function(){
          $scope.data.items = TraktSrvc.getMovieWatchlist();
        });
    };

    $scope.getUserListDetail = function(id){
      if(id != $scope.currentListId){
        $scope.data.items = null;
        $scope.currentListId = id;
        $scope.searching = true;

        TraktSrvc.fetchUserListDetail(id).
          then(function(){
            $scope.error = null;
            $scope.searching = false;
            $scope.data.items = TraktSrvc.getUserListDetail();
          }, function(){
            $scope.error = "Something went wrong with receiving the data";
            $scope.searching = false;
          });
      }
    };

    $scope.removeMovieFromList = function(item){
      if($scope.currentListId != "watchlist") {
        TraktSrvc.removeMovieFromCustomList($scope.currentListId, item).
          then(function(){
            //$scope.error = "Success!";
          });
      }
      else {
        TraktSrvc.removeMovieFromWatchlist(item.movie.ids.imdb).
          then(function(){
            //$scope.error = "Success!";
          });
      }
    };

    getRecentlyRated();

    function getRecentlyRated(){
      TraktSrvc.fetchMovieRatings().
        then(function(){
          $scope.data.recentlyRated = TraktSrvc.getMovieRatings();
          console.log($scope.data.recentlyRated);
        });
    }

    $scope.toggleRating = function(id, rating){
      if(id && rating){
        TraktSrvc.addRatingToMovie(id, rating).
          then(function(){
            console.log('Added rating of ' + rating + ' to ' + id);
            getRecentlyRated();
          });
      } else {
        console.log('Some arguments are missing');
      }
    }



  }]);

  /*------------------------------------*\
      #HELPERS
  \*------------------------------------*/





})();
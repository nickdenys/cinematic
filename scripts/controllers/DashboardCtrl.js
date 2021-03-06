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
            $scope.searching = false;
            $scope.data.items = TraktSrvc.getUserListDetail();
          }, function(){
            $scope.searching = false;
          });
      }
    };

    $scope.removeItemFromList = function(item){
      if($scope.currentListId != "watchlist") {
        TraktSrvc.removeItemFromCustomList($scope.currentListId, item).
          then(function(){
            showNotification(1, "Successfully removed item from list");
          });
      }
      else {
        TraktSrvc.removeItemFromWatchlist(item).
          then(function(){
            showNotification(1, "Successfully removed item from watchlist");
          });
      }
    };

    getRecentlyRated();
    getRecentlyViewed();
    getUserStats();

    function getUserStats(){
      TraktSrvc.fetchUserStats().
        then(function(){
          $scope.data.stats = TraktSrvc.getUserStats();
          console.log($scope.data.stats);
          if(!$scope.data.stats.movies.watched){
            $scope.data.stats.movies.watched=0;
          }
          if(!$scope.data.stats.shows.watched){
            $scope.data.stats.shows.watched=0;
          }
          if(!$scope.data.stats.episodes.watched){
            $scope.data.stats.episodes.watched=0;
          }
        });
    }

    function getRecentlyRated(){
      TraktSrvc.fetchMovieRatings().
        then(function(){
          $scope.data.recentlyRated = TraktSrvc.getMovieRatings();
        });
    }

    function getRecentlyViewed(){
      TraktSrvc.fetchHistory().
        then(function(){
          $scope.data.recentlyViewed = TraktSrvc.getHistory();
        });
    }

    $scope.toggleRating = function(id, rating){
      if(id && rating){
        TraktSrvc.addRatingToMovie(id, rating).
          then(function(){
            getRecentlyRated();
          });
      } else {
        showNotification(2, "Something went wrong. Try refreshing the page.");
      }
    };

    $scope.parseDate = function(date){
      var y = moment(date).format("MMM DD, YYYY h:mm A");

      return y;
    }



  }]);

  /*------------------------------------*\
      #HELPERS
  \*------------------------------------*/





})();
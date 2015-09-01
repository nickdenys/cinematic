(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.MovieSearchCtrl', ['$scope', 'cmApp.services.TraktSrvc', function($scope, TraktSrvc) {

        $scope.results = null;
        $scope.movies = null;
        $scope.searchString = "";
        $scope.searching = false;

        $scope.isUserLoggedIn = function(){
            return TraktSrvc.getToken();
        };

        $scope.searchMovie = function(){
            $scope.selectedMovie = {};
            $scope.similarMovies = null;
            $scope.error = "";
            $scope.results = null;
            $scope.searching = true;
            $scope.searchingMovies = true;
            // Execute search query
            if ($scope.searchString.length >= 3) {
                theMovieDb.search.getMovie({"query":$scope.searchString}, successCB, errorCB);
            }
            else {
                this.error = "Woops! Your search term needs to be at least 3 characters long.";
            }
        };

        $scope.getSimilarMovies = function(id, title){
            $scope.selectedMovie = {};
            $scope.selectedMovie.title = title;
            $scope.selectedMovie.id = id;
            $scope.similarMovies = null;
            $scope.searching = true;
            theMovieDb.movies.getSimilarMovies({"id":id },
              function(data) {
                  var searchScope = angular.element($('.search-movie')).scope();
                  searchScope.$apply(function(){
                      searchScope.similarMovies = JSON.parse(data);
                      searchScope.searching = false;
                  });
              },
              function(error){
                  console.log(error);
              }
            );
        };

        $scope.isActive = function(id){
            if ($scope.selectedMovie.id) {
                if ($scope.selectedMovie.id === id){
                    return true
                }
                return false;
            }
            else {
                return true;
            }
        };

        $scope.clearAll = function(){
            $scope.similarMovies = null;
            $scope.selectedMovie.id = null;
            $scope.selectedMovie.title = null;
            $scope.results = null;
            $scope.searchString = null;
        };

        $scope.getMovieDetail = function(id){

            $('#modal').show();
            $("body").addClass("modal-open");
            $('.cm-userdropdown').addClass('hidden');

            var wrapper = $('.search-movie');
            $scope.data.movieDetail = {};
            theMovieDb.movies.getById({"id":id },
              function(data) {
                  var scope = angular.element(wrapper).scope();
                  scope.$apply(function () {
                      scope.data.movieDetail.basic = JSON.parse(data);
                  });
                  if($scope.isUserLoggedIn()){
                      isMovieInWatchlist($scope.data.movieDetail.basic.imdb_id);
                      isMovieInRatings($scope.data.movieDetail.basic.imdb_id);
                  }
              },function(error) {
                  console.log(error);
              }
            );

            theMovieDb.movies.getTrailers({"id":id},
              function(data) {
                  var scope = angular.element($('.search-movie')).scope();
                  scope.$apply(function () {
                      scope.data.movieDetail.trailers = JSON.parse(data);
                  });
              }, function(error) {
                  console.log(error);
              }
            );

            theMovieDb.movies.getCredits({"id":id},
              function(data) {
                  var scope = angular.element($('.search-movie')).scope();
                  scope.$apply(function () {
                      scope.data.movieDetail.credits = JSON.parse(data);
                  });
              }, function(error) {
                  console.log(error);
              }
            );

        };

        /*------------------------------------*\
            #TRAKT FUNCTIONALITY
        \*------------------------------------*/

        if($scope.isUserLoggedIn()){
            $scope.watchlist = [];
            updateWatchlist();
            updateRatings();
        }


        function updateWatchlist(){
            TraktSrvc.fetchMovieWatchlist().
              then(function(){
                  $scope.watchlist = TraktSrvc.getMovieWatchlistById();
              });
        }
        function updateRatings(){
            TraktSrvc.fetchMovieRatings().
              then(function(){
                  $scope.userRatings = TraktSrvc.getMovieRatings();
              })
        }

        $scope.addToWatchlist = function(id){
            TraktSrvc.addMovieToWatchlist(id).
              then(function(){
                  updateWatchlist();
                  $scope.data.movieDetail.watchlist = true;
              });
        };
        $scope.removeFromWatchlist = function(id){
            TraktSrvc.removeItemFromWatchlist(id).
              then(function(){
                  updateWatchlist();
                  $scope.data.movieDetail.watchlist = false;
              });
        };

        $scope.previewRatingFunc = function(rating){
            $scope.previewRating = rating;
        };

        $scope.toggleRating = function(id, rating){
            if(id && rating){
                if(typeof $scope.previewRating == "string"){
                    TraktSrvc.removeMovieRating(id).
                      then(function(){
                          $scope.rating = -1;
                          $scope.previewRating = null;
                      });
                } else {
                    TraktSrvc.addRatingToMovie(id, rating).
                      then(function(){
                          console.log('Added rating of ' + rating + ' to ' + id);
                          updateRatings();
                      });
                }
            } else {
                console.log('Some arguments are missing');
            }
        };

        $scope.manageLists = function(){
            $scope.data.userLists = TraktSrvc.getUserLists();
            if(!$scope.data.userLists.length){
                TraktSrvc.fetchUserLists().
                  then(function(){
                      $scope.data.userLists = TraktSrvc.getUserLists();
                      $scope.checkIfMovieIsInLists($scope.data.movieDetail.basic.imdb_id);
                  });
            } else {
                $scope.checkIfMovieIsInLists($scope.data.movieDetail.basic.imdb_id);
            }
        };

        $scope.addItemToList = function(id, list){
            TraktSrvc.addItemToCustomList(id, list.ids.trakt).
              then(function(){
                  //$scope.error = "Successfully added to list";
                  $scope.checkIfMovieIsInLists($scope.data.movieDetail.basic.imdb_id);
              }, function(){
                  //$scope.error = "Something went wrong";
              });
        };

        $scope.checkIfMovieIsInLists = function(id){
            $scope.data.matchingListIds = [];
            for(var i = 0; i < $scope.data.userLists.length; i++){
                var listId = $scope.data.userLists[i].ids.trakt;
                TraktSrvc.fetchUserListDetail(listId).
                  then(function(){
                      var currentList = TraktSrvc.getUserListDetail();
                      var currentListId = TraktSrvc.getUserListDetailId();
                      for (var j = 0; j < currentList.length; j++){
                          if(currentList[j].movie && id == currentList[j].movie.ids.imdb){
                              $scope.data.matchingListIds.push(currentListId);
                          }
                      }
                  });
            }
        };

        $scope.checkIfCurrentItemIsInList = function(list){
            var id = list.ids.trakt;
            return $scope.data.matchingListIds.indexOf(id) > -1;
        };

        $scope.checkInMovie = function(id){
            TraktSrvc.checkInMovie(id).
              then(function(response){
                  if (response.status == 409){
                      console.log("You are already watching something else!");
                      //$scope.error = "You are already watching something else!";
                  } else {
                      console.log("You are now watching", response.data.movie.title);
                      //$scope.error = "You are now watching" + response.data.movie.title;
                  }
              }, function(reponse){
                  //$scope.error = "Something went wrong";
              });
        }

    }]);

    function successCB(data) {
        // Parse JSON as object
        var parsedData = JSON.parse(data);

        // Access scope from outside angular
        var searchWrapper = $('.search-movie');
        var searchScope = angular.element(searchWrapper).scope();
        searchScope.$apply(function(){
            searchScope.data = parsedData;
            searchScope.results = parsedData.results;
            searchScope.movies = parsedData.results;
            searchScope.searching = false;
            searchScope.searchingMovies = false;
        });
    }

    function errorCB(error) {
        console.log(error);
        var searchWrapper = $('.search-movie');
        var searchScope = angular.element(searchWrapper).scope();
        searchScope.$apply(function(){
            searchScope.searching = false;
            searchScope.searchingMovies = false;
        });
    }


    /*------------------------------------*\
     #HELPERS
     \*------------------------------------*/

    function isMovieInWatchlist(id){
        if(id){
            var wrapper = $('.search-movie');
            var scope = angular.element(wrapper).scope();
            scope.$apply(function () {
                if(scope.watchlist.indexOf(id) > -1){
                    scope.data.movieDetail.watchlist = true;
                } else {
                    scope.data.movieDetail.watchlist = false;
                }
            });
        }
    }

    function isMovieInRatings(id){
        if(id){
            var wrapper = $('.search-movie');
            var scope = angular.element(wrapper).scope();
            scope.$apply(function(){
                scope.data.movieDetail.userRating = null;
                scope.rating = 0;

                if(scope.userRatings.length){
                    for (var i = 0; i < scope.userRatings.length; i++){
                        var item = scope.userRatings[i];

                        if(id === item.movie.ids.imdb){
                            scope.data.movieDetail.userRating = item.rating;
                            scope.rating = item.rating;
                        }
                    }
                }
            })
        }
    }



})();
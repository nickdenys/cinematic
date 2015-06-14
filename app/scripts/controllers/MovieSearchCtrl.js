(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.MovieSearchCtrl', ['$scope', function($scope) {

        $scope.results = null;
        $scope.movies = null;
        $scope.searchString = "";
        $scope.searching = false;

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
                      console.log(searchScope.similarMovies);
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

        $scope.getMovieDetail = function(id){
            $scope.searching = true;
            theMovieDb.movies.getById({"id":id },
              function(data){
                  var searchScope = angular.element($('.search-movie')).scope();
                  searchScope.$apply(function(){
                      searchScope.movieDetail = JSON.parse(data);
                      searchScope.searching = false;
                      console.log(searchScope.movieDetail);
                  });
              },
              function(error){
                console.log(error);
              }
            );
        };

        $scope.clearAll = function(){
            $scope.similarMovies = null;
            $scope.selectedMovie.id = null;
            $scope.selectedMovie.title = null;
            $scope.results = null;
            $scope.searchString = null;
        };

        $scope.getMovieDetail = function(id){
            $scope.data.movieDetail = {};
            theMovieDb.movies.getById({"id":id },
              function(data) {
                  var scope = angular.element($('.search-movie')).scope();
                  scope.$apply(function () {
                      scope.data.movieDetail.basic = JSON.parse(data);
                  });
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



})();
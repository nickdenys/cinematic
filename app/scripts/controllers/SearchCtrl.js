(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.SearchCtrl', ['$scope', function($scope) {

        $scope.getNumber = function(num) { return new Array(num); };
        $scope.results = null;
        $scope.movies = null;
        $scope.tvshows = null;
        $scope.searchString = "";
        $scope.page = 1;
        $scope.searchInitialized = true;
        $scope.searchMovie = function(){
            this.error = "";
            this.results = null;
            this.page = 1;
            // Execute search query
            if ($scope.searchString.length >= 3) {
                $scope.searchInitialized = false;
                // Currently not using angular service, look for it later !
                theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
                //theMovieDb.search.getMulti({"query":this.searchString}, successCB, errorCB);
            }
            else {
                this.error = "Your search term needs to be at least 3 characters.";
            }
        };


        $scope.renderSearchPage = function(page){
            $scope.page = page;
            console.log($scope.searchString);
            theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
        };
        $scope.renderNextSearchPage = function(){
            if ($scope.page < $scope.data.total_pages) {
                $scope.page = $scope.page + 1;
                console.log($scope.searchString);
                theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
            }
        };
        $scope.renderPrevSearchPage = function(){
            if ($scope.page > 1) {
                $scope.page = $scope.page - 1;
                console.log($scope.searchString);
                theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
            }
        }
    }]);

    function successCB(data) {
        // Parse JSON as object
        var parsedData = JSON.parse(data);
        console.log(parsedData);

        // Access scope from outside angular
        var searchWrapper = $('.search-wrapper');
        var searchScope = angular.element(searchWrapper).scope();
        searchScope.$apply(function(){
            searchScope.searchInitialized = true;
            searchScope.data = parsedData;
            searchScope.results = parsedData.results;
            searchScope.movies = parsedData.results;
        });


        // put movies, tv shows and people in seperate models
        //var _movies = [];
        // var _tvshows = [];
        // var _people = [];
        // $.each(parsedData.results, function(i, result){
        //   //console.log(result.media_type);
        //   switch(result.media_type) {
        //     case "movie":
        //       _movies.push(result);
        //       break;
        //     case "tv":
        //       _tvshows.push(result);
        //       break;
        //   }
        // });
    }

    function errorCB() {
        console.log('error');
    }



})();
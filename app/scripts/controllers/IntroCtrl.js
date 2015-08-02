(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.IntroCtrl', ['$scope','$location', '$anchorScroll', 'cmApp.services.TraktSrvc', function($scope, $location, $anchorScroll, TraktSrvc) {

        $scope.movies = [];
        $scope.tvshows = [];
        $scope.movie = null;
        $scope.tvshow = null;
        $scope.getSomePopularMovie = function(){
            theMovieDb.movies.getPopular({page:1}, movieSuccessCB, movieErrorCB);
        };
        $scope.getSomePopularTvShow = function(){
            theMovieDb.tv.getPopular({page:1}, tvSuccessCB, tvErrorCB);
        };

        $scope.$on('oauth:authorized', function(event, token) {
            console.log('The user is authorized', token.access_token);
            TraktSrvc.saveToken(token.access_token);
            $scope.token = token.access_token;

            TraktSrvc.fetchMovieWatchlist();
        });

        $scope.$on('oauth:logout', function(event) {
            TraktSrvc.saveToken(null);
            $scope.token = null;
        });

        $scope.$on('oauth:denied', function(event) {
            console.log('The user did not authorize the third party app');
        });

        $scope.$on('oauth:expired', function(event) {
            console.log('The access token is expired. Please refresh.');
        });

    }]);



    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // How many items do we need?
    var x = 10;

    function movieSuccessCB(data) {
        var parsedData = JSON.parse(data);
        //console.log(parsedData);

        var introWrapper = $('.intro-wrapper');
        var scope = angular.element(introWrapper).scope();
        scope.$apply(function(){
            for (var i = 0; i < x; i++){
                scope.movies[i] = parsedData.results[i];
            }

            scope.movie = scope.movies[getRandomInt(0,scope.movies.length)];
        });
    }

    function tvSuccessCB(data) {
        var parsedData = JSON.parse(data);
        var introWrapper = $('.intro-wrapper');
        var scope = angular.element(introWrapper).scope();
        scope.$apply(function(){
            for (var i = 0; i < x; i++){
                scope.tvshows[i] = parsedData.results[i];
            }

            scope.tvshow = scope.tvshows[getRandomInt(0,scope.tvshows.length)];
        });
    }

    function movieErrorCB(error) {
        console.log(error);
    }

    function tvErrorCB(error) {
        console.log(error);
    }

})();
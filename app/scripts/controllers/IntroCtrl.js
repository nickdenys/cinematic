(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.IntroCtrl', ['$scope','$location', '$anchorScroll', function($scope,$location, $anchorScroll) {

        /*$scope.test = function(){
            theMovieDb.certifications.getList(
                function(data){
                console.log(JSON.parse(data));
            },
                function(){
                console.log('error');
            });
        };*/

        $scope.movies = [];
        $scope.tvshows = [];
        $scope.movie = null;
        $scope.tvshow = null;
        $scope.getSomePopularMovie = function(){
            theMovieDb.movies.getPopular({page:1}, movieSuccessCB, movieErrorCB);
        };
        $scope.getSomePopularTvShow = function(){
            theMovieDb.tv.getPopular({page:1}, tvSuccessCB, tvErrorCB);
        }


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
        //console.log(parsedData);

        var introWrapper = $('.intro-wrapper');
        var scope = angular.element(introWrapper).scope();
        scope.$apply(function(){
            for (var i = 0; i < x; i++){
                scope.tvshows[i] = parsedData.results[i];
            }

            scope.tvshow = scope.tvshows[getRandomInt(0,scope.tvshows.length)];
        });
    }

    function movieErrorCB() {
        console.log('error');
    }

    function tvErrorCB() {
        console.log('error');
    }

})();
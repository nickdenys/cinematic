(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.DiscoverMovieCtrl', ['$scope', 'localStorageService','cmApp.services.TMDbService', function($scope, localStorageService, TMDbService) {

    $scope.movieYear = null;
    $scope.results = null;
    $scope.searchPeopleInput = null;
    $scope.peopleSearchResults = null;
    $scope.selectedPeople = {};

    localStorageService.set('localstorage', true);

    //console.log(TMDbService.test());

    $scope.getPerson = function(name){
      var name = encodeURI(name);
      theMovieDb.search.getPerson(
        {"query":name},
        function(data){
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function(){
            scope.peopleSearchResults = JSON.parse(data);
            console.log(scope.peopleSearchResults);
          });
        },
        function(){
          console.log('error');
        });
    };

    $scope.togglePeople = function(id,name){




      if (id in $scope.selectedPeople){
        delete $scope.selectedPeople[id];
      } else {
        $scope.selectedPeople[id] = name;
      }

      $scope.getMovies();

      console.log($scope.selectedPeople);
    };

    $scope.getMovies = function(){
      if ($scope.selectedPeople.length){
        theMovieDb.discover.getMovies(
        {
          primary_release_year: $scope.movieYear,
          //primary_release_year.gte: $scope.movieYear,
          'with_cast': $scope.selectedPeople   // Brad Pitt
          //with_genres: 35   // Action
        },
        function(data){
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function(){
            scope.results = JSON.parse(data).results;
              console.log(scope.results);
          });
        },
        function(){
          console.log('error');
        });
      }
      else {
        console.log('please select some people');
      }
    }

  }]);

})();
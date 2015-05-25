(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.DiscoverMovieCtrl', ['$rootScope','$scope', '$http','$routeParams','$location','localStorageService','cmApp.services.QuestionSrvc', function($rootScope, $scope, $http, $routeParams, $location, localStorageService, QuestionSrvc) {

    /* DATA */
    $scope.data = {};
    $scope.data.questionNo = 1;
    $http.get('./data/questions.json').success(function (data){
      $scope.data.questions = data.questions;
      $scope.data.question = data.questions.movies[$scope.data.questionNo-1];
      $scope.questionID = $scope.data.question.id;
    });





    /* QUESTION CONTROLS */
    $scope.getPrevQuestion = function(){
      if (this.data.questionNo > 1) {
        var prevQuestionNo = (this.data.questionNo*1 - 1);
        $scope.data.answer = QuestionSrvc.getAnswer(prevQuestionNo);

        this.data.questionNo--;
      }
    };
    $scope.getNextQuestion = function(){
      if (this.data.questionNo < this.data.questions.movies.length) {
        console.log($scope.answer);
        QuestionSrvc.setAnswer(this.data.questionNo, this.data.answer);

        this.data.answer = null;
        this.data.questionNo++;
      }
    };

    // Watch the questionID and fetch correct function for it
    $scope.$watch(
      function(scope) {
        if ($scope.data.questions)
          $scope.questionID = $scope.data.questions.movies[$scope.data.questionNo - 1].id;
        return scope.questionID;
      },
      function(newValue, oldValue) {
        if ( newValue !== oldValue ) {
          switch(newValue){
            case 'genre':{
              prepareGenre();
              break;
            }
            case 'duration':{
              prepareDuration();
              break;
            }
            default:{
              $scope.answerType = null;
            }
          }

        }
      }
    );




    /* PREPARE DIFFERENT QUESTIONS */

    // Genre
    function prepareGenre() {
      $scope.answerType = "multiple";
      theMovieDb.genres.getList({}, function(data){
        var scope = angular.element($('.discover-movie')).scope();
        scope.$apply(function(){
          var result = JSON.parse(data);
          $scope.data.multipleResults = result.genres;
        });
      }, function(){
        console.log('error');
      })
    }
    $scope.data.multipleSelection = {};
    $scope.addToSelection = function(id, name){
      // Check for doubles --> remove if true
      if (id in $scope.data.multipleSelection){
        delete $scope.data.multipleSelection[id];
      } else {
        $scope.data.multipleSelection[id] = name;
      }
      console.log($scope.data.multipleSelection);
      $scope.data.answer = $scope.data.multipleSelection;
    };

    // Duration
    function prepareDuration() {
      $scope.data.answer = "0";
      $scope.answerType = "slider-duration";
    }
    $scope.saveDuration = function(val){
      console.log(val);
      $scope.data.answer = val;
    };





    /*$scope.movieYear = null;
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
    }*/

  }]);

})();
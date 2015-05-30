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
      $scope.data.questionID = $scope.data.question.id;
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
        console.log($scope.data.answer);
        QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);

        this.data.answer = null;
        this.data.questionNo++;
      }
    };

    // Watch the questionID and fetch correct function for it
    $scope.$watch(
      function(scope) {
        if (scope.data.questions)
          scope.data.questionID = scope.data.questions.movies[scope.data.questionNo - 1].id;
        return scope.data.questionID;
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
            case 'rating':{
              prepareRating();
              break;
            }
            case 'cast':{
              prepareCast();
              break;
            }
            case 'year':{
              prepareYear();
              break;
            }
            case 'crew':{
              prepareCrew();
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
    $scope.data.multipleSelection = [];
    $scope.addToSelection = function(id, name){
      // Check for doubles --> remove if true
      /*if (id in $scope.data.multipleSelection){
        delete $scope.data.multipleSelection[id];
      } else {
        $scope.data.multipleSelection[id] = name;
      }*/
      $scope.item = {};
      $scope.item.id = id;
      $scope.item.name = name;

      if (checkDoubles()) {
        console.log('double');
      } else {
        console.log('adding');
        $scope.data.multipleSelection.push($scope.item);
      }

      $('.genres li[data-id="' + id + '"]').toggleClass('active');
      console.log($scope.data.multipleSelection);
      $scope.data.answer = $scope.data.multipleSelection;
    };
    function checkDoubles() {

      if ($scope.data.multipleSelection.length) {
        for(var i = 0; i<$scope.data.multipleSelection.length; i++){
          if ($scope.data.multipleSelection[i].id == $scope.item.id){
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }

    // Duration
    function prepareDuration() {
      $scope.answerType = "slider-duration";
      $scope.data.answer = "0";
    }
    $scope.saveDuration = function(val){
      console.log(val);
      $scope.data.answer = val;
    };

    // Rating
    function prepareRating() {
      $scope.answerType = "slider-rating";
      $scope.data.answer = 1;
    }
    $scope.saveRating = function(val){
      console.log(val);
      $scope.data.answer = val;
    };

    // Cast & Crew
    function prepareCast() {
      $scope.answerType = "input_cast";
      $scope.data.answer = {};
    }
    function prepareCrew() {
      $scope.answerType = "input_crew";
      $scope.data.answer = {};
    }
    $scope.getPerson = function(name){
      var _name = encodeURI(name);
      theMovieDb.search.getPerson(
        {"query":_name},
        function(data){
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function(){
            scope.data.peopleSearchResults = JSON.parse(data);
            console.log(scope.data.peopleSearchResults);
          });
        },
        function(){
          console.log('error');
        });
    };
    $scope.data.selectedCast = {};
    $scope.data.selectedCrew = {};
    $scope.toggleCast = function(id,name){

      if (id in this.data.selectedCast){
        delete this.data.selectedCast[id];
      } else {
        this.data.selectedCast[id] = name;
      }

      this.data.answer = this.data.selectedCast;
      console.log(this.data.answer);
    };
    $scope.toggleCrew = function(id,name){

      if (id in this.data.selectedCrew){
        delete this.data.selectedCrew[id];
      } else {
        this.data.selectedCrew[id] = name;
      }

      this.data.answer = this.data.selectedCrew;
      console.log(this.data.answer);
    };

    // Year
    function prepareYear() {
      $scope.answerType = "select_year";
      $scope.data.answer = {};
    }
    $scope.single = null;
    var _years = getYears();
    function getYears() {
      var _data = [];
      var _startYear = 1900;
      var _currentYear = new Date().getFullYear();
      var _count = 0;
      for (var i = _currentYear; i >= _startYear; i--){
        var item = {};
        item.value = _count + 1;
        item.text = i;

        _data.push(item);
        _count++;
      }
      return _data;
    }
    $scope.singleConfig = {
      options: _years,
      create: false,
      sortField: {field: "text", direction: "desc"},
      maxItems: 1
    };


    /* GET RESULTS */
    $scope.getMovies = function() {
      console.log(QuestionSrvc.getAnswer("genre"));
      /*theMovieDb.discover.getMovies(
        {
          with_genres: QuestionSrvc.getAnswer("genre")
        },
        function (data) {
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function () {
            scope.data.results = JSON.parse(data).results;
            console.log(scope.data.results);
          });
        },
        function () {
          console.log('error');
        });*/
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
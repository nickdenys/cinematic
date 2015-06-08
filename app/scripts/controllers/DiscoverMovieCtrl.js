(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.DiscoverMovieCtrl', ['$rootScope','$scope', '$http','$routeParams','$location','localStorageService','cmApp.services.QuestionSrvc', function($rootScope, $scope, $http, $routeParams, $location, localStorageService, QuestionSrvc) {

    /* DATA */
    $scope.data = {};
    $http.get('./data/questions.json').success(function (data){
      $scope.data.questions = data.questions;
    });




    /* QUESTION CONTROLS */
    $scope.data.toggledQuestions = [];
    $scope.toggleQuestion = function(id, ev){
      // Make sure the checkbox is only toggled once
      if(ev.target.tagName == "INPUT") {
        var _found = $.inArray(id, $scope.data.toggledQuestions);
        if (_found > -1) {
          $scope.data.toggledQuestions.splice(_found,1);
        } else {
          $scope.data.toggledQuestions.push(id);
        }
      }
    };
    $scope.isToggled = function(id) {
      var _found = $.inArray(id, $scope.data.toggledQuestions) > -1;
      return _found ? true : false;
    };
    $scope.getQuestion = function(nr, id){
      $scope.data.results = null;
      $scope.data.questionNo = nr;
      $scope.data.questionID = id;
    };
    /*$scope.getPrevQuestion = function(){
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
    };*/

    // Watch the questionID and fetch correct function for it
    $scope.$watch(
      function(scope) {
        if (scope.data.questions)
          //scope.data.questionID = scope.data.questions.movies[scope.data.questionNo - 1].id;
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
      $scope.data.answer = {};
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
      $scope.item = {};
      $scope.item.id = id;
      $scope.item.name = name;

      // Check for doubles --> remove if true
      if (checkDoubles() !== false) {
        $scope.data.multipleSelection.splice(checkDoubles(), 1)
      } else {
        $scope.data.multipleSelection.push($scope.item);
      }

      $('.genres li[data-id="' + id + '"]').toggleClass('active');
      console.log($scope.data.multipleSelection);
      $scope.data.answer = $scope.data.multipleSelection;
      QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);
    };
    function checkDoubles() {

      if ($scope.data.multipleSelection.length) {
        for(var i = 0; i<$scope.data.multipleSelection.length; i++){
          if ($scope.data.multipleSelection[i].id == $scope.item.id){
            return i;
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
      $scope.data.answer = 0;
      QuestionSrvc.setAnswer("duration", $scope.data.answer);
    }
    $scope.saveDuration = function(val){
      console.log(val);
      $scope.data.answer = val;
      QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);
    };
    $scope.$on("slideEnded", function() {
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    });

    // Rating
    function prepareRating() {
      $scope.answerType = "slider-rating";
      $scope.data.answer = 55;
      $scope.data.ratings = [];
      for (var i = 1; i<=100; i++){
        if (i%10 == 0)
          $scope.data.ratings.push(i);
      }
    }
    $scope.saveRating = function(val){
      console.log(val);
      $scope.data.answer = val;
      QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);
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
      QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);
    };
    $scope.toggleCrew = function(id,name){

      if (id in this.data.selectedCrew){
        delete this.data.selectedCrew[id];
      } else {
        this.data.selectedCrew[id] = name;
      }

      this.data.answer = this.data.selectedCrew;
      console.log(this.data.answer);
      QuestionSrvc.setAnswer(this.data.questionID, this.data.answer);
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
        item.value = i;
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
      maxItems: 1,
      onChange: function(){
        QuestionSrvc.setAnswer($scope.data.questionID, parseInt($scope.data.answer));
      }
    };








    /* FILTER RESULTS */
    /* necessary to match api requirements! */

    // Get all movies released today or earlier
    function filterReleaseDate() {
      var answeredYear = QuestionSrvc.getAnswer("year");
      var data = "";
      if (typeof(answeredYear) != 'object'){
        data += answeredYear + "-12-31";
        return data;
      } else {
        var today = new Date();
        var year = today.getFullYear();
        var month = ("0" + (today.getMonth() + 1)).slice(-2);
        var day = ("0" + today.getDate()).slice(-2);
        return year+'-'+month+'-'+day;
      }
    }
    function filterGenres() {
      var genres = QuestionSrvc.getAnswer("genre");
      var data = "";
      if (genres) {
        for (var i = 0; i < genres.length; i++) {
          var id = genres[i].id;
          if (data === "")
            data += "" + id;
          else
            data += "|" + id;
        }
        return data;
      }
    }
    function filterRating() {
      var rating = QuestionSrvc.getAnswer("rating") / 10;
      return rating.toFixed(2);
    }
    function filterCast() {
      var castData = QuestionSrvc.getAnswer("cast");
      var data = "";
      for(var property in castData){
        if (castData.hasOwnProperty(property)){
          if (data === "")
            data += "" + property;
          else
            data += "|" + property;
        }
      }
      return data;
    }
    function filterCrew() {
      var castData = QuestionSrvc.getAnswer("crew");
      var data = "";
      for(var property in castData){
        if (castData.hasOwnProperty(property)){
          if (data === "")
            data += "" + property;
          else
            data += "|" + property;
        }
      }
      return data;
    }



    function filterData(data) {
      var scope = angular.element($('.discover-movie')).scope();
      scope.$apply(function () {
        scope.data.results = JSON.parse(data).results;
        console.log(scope.data.results);
      });

      /*$scope.data.results = JSON.parse(data).results;
      console.log($scope.data.results);*/

      /*

      // Link duration value to minutes
      var durationAnswers = $scope.data.questions.movies[1].answers;
      $scope.data.runtime = durationAnswers[QuestionSrvc.getAnswer("duration")].minutes;
      //$scope.data.runtime = $scope.data.questions.movies[1].answers[QuestionSrvc.getAnswer("duration")].minutes;
      //console.log($scope.data.runtime);

      if (QuestionSrvc.getAnswer("duration") != 0){

        $scope.data.filteredResults = [];

        // Get runtime for each movie
        for(var i=0; i< parsedData.length; i++){
          var movieId = parsedData[i].id;
          theMovieDb.movies.getById({"id":movieId },
            function(data){
              var parsedMovie = JSON.parse(data);
              var scope = angular.element($('.discover-movie')).scope();
              scope.$apply(function(){

                scope.data.filteredResults.push(parsedMovie);
                // Check runtimes
                if (parsedMovie.runtime >= scope.data.runtime) {
                  // Add each movie to scope.data.filteredResults
                  scope.data.filteredResults.push(parsedMovie);
                }
              });
            },function(error){
              console.log(error);
            });
        }
        console.log("filtered: " + $scope.data.filteredResults);
      } else {
        console.log('doesnt matter');
        $scope.data.results = parsedData;
      }*/
    }






    /* CLEAR ANSWERS */

    function clearAll(){
      $scope.data.answer = {};
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    }
    $scope.clearGenres = function(){
      this.data.multipleSelection = [];
      $('.genres li').removeClass('active');
      clearAll();
    };



    /* GET RESULTS */

    $scope.getMovies = function() {

      console.log("getting movies");

      theMovieDb.discover.getMovies(
        {
          'primary_release_date.lte': filterReleaseDate(),
          'vote_average.gte': filterRating(),
          'with_cast': filterCast(),
          'with_crew': filterCrew(),
          'with_genres': filterGenres()
        },
        function (data) {
          filterData(data);
          console.log("success");
          /*var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function () {
            scope.data.results = JSON.parse(data).results;
            console.log(scope.data.results);
          });*/
        },
        function (error) {
          console.log(error);
        });
    };

  }]);

})();
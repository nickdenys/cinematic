(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.MovieDiscoverCtrl', ['$rootScope','$scope', '$http','$routeParams','$location','localStorageService','cmApp.services.QuestionSrvc', 'cmApp.services.TraktSrvc', function($rootScope, $scope, $http, $routeParams, $location, localStorageService, QuestionSrvc, TraktSrvc) {

    /*------------------------------------*\
        #DATA
    \*------------------------------------*/

    $scope.data = {};
    // Fetch own questions
    $http.get('./data/questions.json').success(function (data){
      $scope.data.questions = data.questions;
    });


    /*------------------------------------*\
        #FILTER CONTROLS
    \*------------------------------------*/
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
    $scope.activeFilter = function(id){
      return id === $scope.data.questionID;
    };
    // Watch the questionID and fetch correct function for it
    $scope.$watch(
      function(scope) {
        if (scope.data.questions)
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


    /*------------------------------------*\
        #PREPARE FILTERS
    \*------------------------------------*/

    // Genre
    $scope.data.multipleSelection = [];
    function prepareGenre() {
      $scope.answerType = "multiple";
      // Get all genres
      if (!$scope.data.multipleResults) {
        theMovieDb.genres.getList({}, function (data) {
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function () {
            var result = JSON.parse(data);
            $scope.data.multipleResults = result.genres;
          });
        }, function (error) {
          console.log(error);
        });
      }
    }
    $scope.checkGenreDoubles = function(id) {
      if ($scope.data.multipleSelection.length) {
        for(var i = 0; i<$scope.data.multipleSelection.length; i++){
          if ($scope.data.multipleSelection[i].id == id){
            return i;
          }
        }
        return false;
      } else {
        return false;
      }
    };
    $scope.addToSelection = function(id, name){
      $scope.item = {};
      $scope.item.id = id;
      $scope.item.name = name;

      // Check for doubles --> remove if true
      if ($scope.checkGenreDoubles(id) !== false) {
        $scope.data.multipleSelection.splice($scope.checkGenreDoubles(id), 1)
      } else {
        $scope.data.multipleSelection.push($scope.item);
      }

      $scope.data.answer = $scope.data.multipleSelection;
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    };

    // Duration & Rating
    function prepareDuration() {
      $scope.answerType = "slider-duration";
      $scope.data.answer = 0;
      QuestionSrvc.setAnswer("duration", $scope.data.answer);
    }
    function prepareRating() {
      $scope.answerType = "slider-rating";
      // Fill slider
      $scope.data.ratings = [];
      for (var i = 1; i<=100; i++){
        if (i%10 == 0)
          $scope.data.ratings.push(i);
      }
      // Check for prev answer
      var prevAnswerRating = QuestionSrvc.getAnswer("rating");
      if (prevAnswerRating) {
        $scope.data.answer = prevAnswerRating;
      } else {
        $scope.data.answer = 55;
      }
    }
    $scope.$on("slideEnded", function() {
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    });

    // Cast & Crew
    function prepareCast() {
      $scope.answerType = "input_cast";
      $scope.data.answer = {};
      $scope.data.peopleSearchResults = null;
    }
    function prepareCrew() {
      $scope.answerType = "input_crew";
      $scope.data.answer = {};
      $scope.data.peopleSearchResults = null;
    }
    $scope.searchingPeople = false;
    $scope.getPerson = function(name){
      $scope.searchingPeople = true;
      var _name = encodeURI(name);
      theMovieDb.search.getPerson(
        {"query":_name},
        function(data){
          var scope = angular.element($('.discover-movie')).scope();
          scope.$apply(function(){
            scope.data.peopleSearchResults = JSON.parse(data);
            scope.searchingPeople = false;
          });
        },
        function(error){
          console.log(error);
          scope.searchingPeople = false;
        });
    };
    $scope.data.selectedCast = {};
    $scope.data.selectedCrew = {};
    $scope.toggleCast = function(id,name){

      if (id in $scope.data.selectedCast){
        delete $scope.data.selectedCast[id];
      } else {
        $scope.data.selectedCast[id] = name;
      }

      $scope.data.answer = $scope.data.selectedCast;
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    };
    $scope.toggleCrew = function(id,name){
      if (id in $scope.data.selectedCrew){
        delete $scope.data.selectedCrew[id];
      } else {
        $scope.data.selectedCrew[id] = name;
      }

      $scope.data.answer = $scope.data.selectedCrew;
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    };
    $scope.checkCastDoubles = function(id){
      return id in $scope.data.selectedCast;
    };
    $scope.checkCrewDoubles = function(id){
      return id in $scope.data.selectedCrew;
    };
    $scope.getCast = function(){
      var castData = QuestionSrvc.getAnswer("cast");
      var data = "";
      for(var property in castData){
        if (castData.hasOwnProperty(property)){
          if (data === "")
            data += "" + castData[property];
          else
            data += " + " + castData[property];
        }
      }
      return data;
    };
    $scope.getCrew = function(){
      var crewData = QuestionSrvc.getAnswer("crew");
      var data = "";
      for(var property in crewData){
        if (crewData.hasOwnProperty(property)){
          if (data === "")
            data += "" + crewData[property];
          else
            data += " + " + crewData[property];
        }
      }
      return data;
    };

    // Year
    function prepareYear() {
      $scope.answerType = "select_year";
      // Check for prev answer
      var prevAnswerRating = QuestionSrvc.getAnswer("year");
      if (prevAnswerRating) {
        $scope.data.answer = prevAnswerRating;
      } else {
        $scope.data.answer = {};
      }
    }
    $scope.startYear = 1900; // Fill years 1900 -> now
    var _years = getYears();
    function getYears() {
      var _data = [];
      var _startYear = $scope.startYear;
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


    /*------------------------------------*\
        #FILTER USER ANSWERS
    \*------------------------------------*/

    function filterReleaseDate() {
      var answeredYear = QuestionSrvc.getAnswer("year");
      var data = "";
      if (typeof(answeredYear) != 'object' && $scope.isToggled("year")){
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
      if (genres && $scope.isToggled("genre")) {
        for (var i = 0; i < genres.length; i++) {
          var id = genres[i].id;
          if (data === "")
            data += "" + id;
          else
            data += "|" + id;
        }
        return data;
      } else {
        return "";
      }
    }
    function filterRating() {
      var rating = QuestionSrvc.getAnswer("rating");
      if (rating && $scope.isToggled("rating")){
        rating = rating / 10;
        return rating.toFixed(2);
      } else {
        return "";
      }

    }
    function filterCast() {
      var castData = QuestionSrvc.getAnswer("cast");
      var data = "";
      if (castData && $scope.isToggled("cast")) {
        for (var property in castData) {
          if (castData.hasOwnProperty(property)) {
            if (data === "")
              data += "" + property;
            else
              data += "|" + property;
          }
        }
      }
      return data;
    }
    function filterCrew() {
      var crewData = QuestionSrvc.getAnswer("crew");
      var data = "";
      if (crewData && $scope.isToggled("crew")) {
        for(var property in crewData){
          if (crewData.hasOwnProperty(property)){
            if (data === "")
              data += "" + property;
            else
              data += "|" + property;
          }
        }
      }
      return data;
    }
    function filterData(data) {
      var scope = angular.element($('.discover-movie')).scope();
      scope.$apply(function () {
        scope.data.results = JSON.parse(data).results;
      });
    }


    /*------------------------------------*\
        #CLEAR ANSWERS
    \*------------------------------------*/

    function clearAnswer(){
      $scope.data.answer = {};
      QuestionSrvc.setAnswer($scope.data.questionID, $scope.data.answer);
    }
    $scope.clearGenres = function(){
      $scope.data.multipleSelection = [];
      clearAnswer();
    };
    $scope.clearFilters = function(){
      QuestionSrvc.clearAllAnswers();
      $scope.data.toggledQuestions = [];
      $scope.data.multipleSelection = [];
      $scope.data.selectedCast = {};
      $scope.data.selectedCrew = {};
      $scope.answerType = null;
      $scope.data.questionNo = null;
      $scope.data.questionID = null;
      $scope.data.results = null;
    };


    /*------------------------------------*\
        #GET RESULTS
    \*------------------------------------*/

    $scope.getMovies = function() {
      $scope.searching = true;

      theMovieDb.discover.getMovies(
        {
          'primary_release_date.lte': filterReleaseDate(),
          'vote_average.gte': filterRating(),
          'with_cast': filterCast(),
          'with_crew': filterCrew(),
          'with_genres': filterGenres()
        },
        function (data) {
          $scope.searching = false;
          filterData(data);
        },
        function (error) {
          console.log(error);
        });
    };
    $scope.getMovieDetail = function(id){
      $('#modal').show();
      $("body").addClass("modal-open");



      var wrapper = $('.discover-movie');
      $scope.data.movieDetail = {};
      theMovieDb.movies.getById({"id":id },
        function(data) {
          var scope = angular.element(wrapper).scope();
          scope.$apply(function () {
            scope.data.movieDetail.basic = JSON.parse(data);
          });
          isMovieInWatchlist($scope.data.movieDetail.basic.imdb_id);
          console.log(scope.data.movieDetail);
        },function(error) {
          console.log(error);
        }
      );

      theMovieDb.movies.getTrailers({"id":id},
        function(data) {
          var scope = angular.element(wrapper).scope();
          scope.$apply(function () {
            scope.data.movieDetail.trailers = JSON.parse(data);
          });
        }, function(error) {
            console.log(error);
        }
      );

      theMovieDb.movies.getCredits({"id":id},
        function(data) {
          var scope = angular.element(wrapper).scope();
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
    $scope.watchlist = [];
    updateWatchlist();

    function updateWatchlist(){
      $scope.watchlist = TraktSrvc.getMovieWatchlist();
      console.log($scope.watchlist);
    }


    $scope.addToWatchlist = function(id){
      TraktSrvc.addMovieToWatchlist(id);
      updateWatchlist();
      $scope.data.movieDetail.watchlist = true;
    };
    $scope.removeFromWatchlist = function(id){
      TraktSrvc.removeMovieFromWatchlist(id);
      updateWatchlist();
      $scope.data.movieDetail.watchlist = false;
    };

  }]);

  /*------------------------------------*\
      #HELPERS
  \*------------------------------------*/

  var wrapper = $('.discover-movie');

  function isMovieInWatchlist(id){
    if (id){
      var wrapper = $('.discover-movie');
      var scope = angular.element(wrapper).scope();
      scope.$apply(function () {
        if (scope.watchlist.indexOf(id) > -1){
          scope.data.movieDetail.watchlist = true;
        } else {
          scope.data.movieDetail.watchlist = false;
        }
      });
    }
  }

})();
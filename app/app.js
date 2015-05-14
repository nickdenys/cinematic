var cinematic = angular.module('testApp', ['ngRoute']);

// Handle routing
cinematic.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/search', {
      templateUrl: 'views/search.html',
      controller: 'SearchController'
    })
    .otherwise({
      redirectTo: "/"
    });
}]);


cinematic.controller("SearchController", function($scope) {
  $scope.getNumber = function(num) {
      return new Array(num);   
  }
  $scope.results = null;
  $scope.movies = null;
  $scope.tvshows = null;
  $scope.searchString = "";
  $scope.page = 1;
  this.searchMovie = function(){
    this.error = "";
    // Execute search query
    if ($scope.searchString.length >= 3)
      // Currently not using angular service, look for it later !
      theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
      //theMovieDb.search.getMulti({"query":this.searchString}, successCB, errorCB);
    else
        this.error = "Your search term needs to be at least 3 characters.";
  };
  $scope.renderSearchPage = function(page){
    $scope.page = page;
    console.log($scope.searchString);
    theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
  }
  $scope.renderNextSearchPage = function(){
    if ($scope.page < $scope.data.total_pages) {
      $scope.page = $scope.page + 1;
      console.log($scope.searchString);
      theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
    }
  }
  $scope.renderPrevSearchPage = function(){
    if ($scope.page > 1) {
      $scope.page = $scope.page - 1;
      console.log($scope.searchString);
      theMovieDb.search.getMovie({"query":$scope.searchString, "page":$scope.page}, successCB, errorCB);
    }
  }
});

function successCB(data) {
  // Parse JSON as object
  var parsedData = JSON.parse(data);
  console.log(parsedData);

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

  // Access scope from external function
  var searchScope = angular.element($('#search-wrapper')).scope();
  searchScope.$apply(function(){
    searchScope.data = parsedData;
    searchScope.results = parsedData.results;
    // searchScope.movies = _movies;
    // searchScope.tvshows = _tvshows;
    searchScope.movies = parsedData.results;
  });
}

function errorCB() {
  console.log('error');
}





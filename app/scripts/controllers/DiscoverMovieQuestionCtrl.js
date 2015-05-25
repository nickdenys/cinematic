(function(){
  'use strict';

  var controllers = angular.module('cmApp.controllers');

  controllers.controller('cmApp.controllers.DiscoverMovieQuestionCtrl', ['$scope','movieQuestion', function($scope,movieQuestion) {

    $scope.question = movieQuestion;
    $scope.loading = true;

  }]);
})();
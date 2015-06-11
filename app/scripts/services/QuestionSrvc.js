(function(){
  'use strict';

  var services = angular.module('cmApp.services');

  services.service('cmApp.services.QuestionSrvc',
    ['$rootScope','$window','$http','$q','localStorageService', function($rootScope,$window,$http,$q,localStorageService){

      var toggledQuestions = [];
      var answers = {};

      return{
        setAnswer:function(id, answer){
          answers[id] = answer;
          localStorageService.set('discover.movie.question.' + id, answer);
        },
        getAnswer:function(id){
          if(answers[id] != null)
            return answers[id];
          else
            return {};
        },
        clearAllAnswers:function(){
          answers = {};
        }
      }

    }]);
})();
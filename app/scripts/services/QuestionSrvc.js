(function(){
  'use strict';

  var services = angular.module('cmApp.services');

  services.service('cmApp.services.QuestionSrvc',
    ['$rootScope','$window','$http','$q','localStorageService', function($rootScope,$window,$http,$q,localStorageService){

      var answers = {};

      return{
        setAnswer:function(id, answer){
          //console.log(id + ':' + answer);
          answers[id] = answer;
          localStorageService.set('discover.movie.questionNo' + id, answer);
          console.log(answers);
        },
        getAnswer:function(id){
          return answers[id];
        }
      }

    }]);
})();
(function(){
  'use strict';

  var services = angular.module('cmApp.services');

  services.factory('cmApp.services.TMDbService', ['$http','$q', function($http, $q){

    // TODO: Rewrite TMDb API to Angular Service

    return{
      test:function(){
       return true;
      }
    };

  }]);
})();
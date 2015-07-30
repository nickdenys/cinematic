(function(){
    'use strict';

    var controllers = angular.module('cmApp.controllers');

    controllers.controller('cmApp.controllers.TestCtrl', ['$scope','$location', 'cmApp.services.TraktSrvc', function($scope, $location, TraktSrvc) {

        $scope.$on('oauth:login', function(event, token) {
            console.log('Authorized third party app with token', token.access_token);
            //TraktSrvc.saveToken(token.access_token);
        });

        $scope.$on('oauth:authorized', function(event, token) {
            console.log('The user is authorized', token.access_token);
            TraktSrvc.saveToken(token.access_token);
        });

        $scope.$on('oauth:loggedOut', function(event) {
            console.log('The user is not signed in');
        });

        $scope.$on('oauth:denied', function(event) {
            console.log('The user did not authorize the third party app');
        });

        $scope.$on('oauth:expired', function(event) {
            console.log('The access token is expired. Please refresh.');
        });

        $scope.$on('oauth:logout', function(event) {
            console.log('The user has signed out');
        });
    }]);


})();